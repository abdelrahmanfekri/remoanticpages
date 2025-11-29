"""
SEO Automation Tools
Automates keyword research, blog post generation, and SEO optimization
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import time

try:
    from anthropic import Anthropic
    import requests
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"Missing dependency: {e}")
    exit(1)


class SEOAutomator:
    """Automate SEO tasks for better organic traffic"""
    
    def __init__(self, config_path: str = "config.json"):
        self.config = self._load_config(config_path)
        self.ai_client = self._init_ai_client()
        self._setup_directories()
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration"""
        if not os.path.exists(config_path):
            config_path = "config.example.json"
        
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def _init_ai_client(self):
        """Initialize AI client"""
        api_key = self.config.get('anthropic_api_key')
        if not api_key or api_key == "YOUR_ANTHROPIC_API_KEY":
            print("⚠️ Warning: API key not configured")
            return None
        
        return Anthropic(api_key=api_key)
    
    def _setup_directories(self):
        """Create output directories"""
        Path(self.config['output']['content_directory']).mkdir(parents=True, exist_ok=True)
        Path(self.config['output']['reports_directory']).mkdir(parents=True, exist_ok=True)
    
    def research_keywords(self, seed_keywords: List[str] = None) -> List[Dict]:
        """Research long-tail keywords"""
        
        if not seed_keywords:
            seed_keywords = self.config['seo']['target_keywords']
        
        print(f"\n🔍 Researching keywords...")
        print(f"Seed keywords: {len(seed_keywords)}")
        
        all_keywords = []
        
        for seed in seed_keywords:
            print(f"\n  Analyzing: '{seed}'")
            
            # Get related keywords
            related = self._get_related_keywords(seed)
            
            # Get question-based keywords
            questions = self._get_question_keywords(seed)
            
            # Combine and score
            for kw in related + questions:
                all_keywords.append({
                    'keyword': kw,
                    'seed': seed,
                    'type': 'question' if '?' in kw or kw.split()[0].lower() in ['how', 'what', 'why', 'when', 'where'] else 'phrase',
                    'estimated_difficulty': self._estimate_difficulty(kw),
                    'priority': self._calculate_priority(kw)
                })
        
        # Sort by priority
        all_keywords.sort(key=lambda x: x['priority'], reverse=True)
        
        # Save keyword research
        output_file = Path(self.config['output']['reports_directory']) / f"keywords_{datetime.now().strftime('%Y%m%d')}.json"
        with open(output_file, 'w') as f:
            json.dump(all_keywords, f, indent=2)
        
        print(f"\n✓ Found {len(all_keywords)} keywords")
        print(f"✓ Saved to: {output_file}")
        
        return all_keywords
    
    def _get_related_keywords(self, seed: str) -> List[str]:
        """Get related keyword variations"""
        
        if not self.ai_client:
            return self._fallback_related_keywords(seed)
        
        prompt = f"""Generate 15 related long-tail keyword variations for: "{seed}"

Context: Romantic digital pages, anniversary gifts, love messages

Focus on:
- User intent keywords (how to, best way to, ideas for)
- Specific use cases (birthday, anniversary, proposal, valentine's day)
- Problem-solving (easy, simple, quick, personalized)
- Comparisons (vs, alternatives, options)

Return one keyword per line, 3-7 words each."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}]
            )
            
            keywords = [line.strip() for line in message.content[0].text.strip().split('\n') if line.strip()]
            keywords = [k.strip('- 0123456789.').lower() for k in keywords]
            return keywords[:15]
            
        except Exception as e:
            print(f"  ⚠️ Error: {e}")
            return self._fallback_related_keywords(seed)
    
    def _fallback_related_keywords(self, seed: str) -> List[str]:
        """Fallback keyword suggestions"""
        modifiers = [
            f"how to create {seed}",
            f"best {seed} ideas",
            f"{seed} for girlfriend",
            f"{seed} for boyfriend",
            f"online {seed} maker",
            f"personalized {seed}",
            f"romantic {seed}",
            f"{seed} templates",
            f"easy {seed}",
            f"quick {seed}"
        ]
        return modifiers
    
    def _get_question_keywords(self, seed: str) -> List[str]:
        """Get question-based keywords"""
        questions = [
            f"how to make {seed}",
            f"what is the best {seed}",
            f"why use {seed}",
            f"when to give {seed}",
            f"where to create {seed}",
            f"how much does {seed} cost",
            f"how long to create {seed}"
        ]
        return questions
    
    def _estimate_difficulty(self, keyword: str) -> str:
        """Estimate keyword difficulty"""
        word_count = len(keyword.split())
        
        if word_count >= 5:
            return 'easy'
        elif word_count >= 3:
            return 'medium'
        else:
            return 'hard'
    
    def _calculate_priority(self, keyword: str) -> int:
        """Calculate keyword priority score"""
        score = 0
        
        # Longer = easier to rank = higher priority
        score += len(keyword.split()) * 10
        
        # Intent keywords
        intent_words = ['how to', 'best', 'ideas', 'create', 'make', 'online']
        for word in intent_words:
            if word in keyword.lower():
                score += 15
        
        # Specific use cases
        occasions = ['birthday', 'anniversary', 'valentine', 'proposal', 'wedding']
        for occasion in occasions:
            if occasion in keyword.lower():
                score += 10
        
        return score
    
    def generate_blog_post(self, keyword: str, word_count: int = 1500) -> Dict:
        """Generate SEO-optimized blog post"""
        
        if not self.ai_client:
            print("❌ AI client not available")
            return {}
        
        print(f"\n✍️ Generating blog post for: '{keyword}'")
        
        # Generate outline first
        outline = self._generate_outline(keyword)
        
        # Generate full article
        article = self._generate_article(keyword, outline, word_count)
        
        # Generate meta data
        meta = self._generate_meta_data(keyword, article)
        
        blog_post = {
            'keyword': keyword,
            'title': meta['title'],
            'meta_description': meta['description'],
            'outline': outline,
            'content': article,
            'word_count': len(article.split()),
            'internal_links': self._suggest_internal_links(keyword),
            'images_needed': self._suggest_images(outline),
            'created_at': datetime.now().isoformat()
        }
        
        # Save blog post
        safe_filename = keyword.replace(' ', '_').replace('/', '_')[:50]
        output_file = Path(self.config['output']['content_directory']) / f"blog_{safe_filename}_{datetime.now().strftime('%Y%m%d')}.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(blog_post, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Blog post generated: {len(article.split())} words")
        print(f"✓ Saved to: {output_file}")
        
        return blog_post
    
    def _generate_outline(self, keyword: str) -> List[str]:
        """Generate article outline"""
        
        prompt = f"""Create a detailed blog post outline for the keyword: "{keyword}"

Context: Business selling romantic digital pages and personalized love messages

Requirements:
- H1: Main title (include keyword)
- 6-8 H2 sections
- Each H2 should have 2-3 H3 subsections
- Include: Introduction, How-to steps, Examples, Tips, FAQ, Conclusion
- Natural keyword integration
- Focus on user intent

Return as hierarchical list:
H1: Title
H2: Section 1
  H3: Subsection 1.1
  H3: Subsection 1.2
H2: Section 2
..."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1200,
                messages=[{"role": "user", "content": prompt}]
            )
            
            outline_text = message.content[0].text.strip()
            outline = [line.strip() for line in outline_text.split('\n') if line.strip()]
            return outline
            
        except Exception as e:
            print(f"  ⚠️ Outline generation error: {e}")
            return [f"H1: {keyword.title()}", "H2: Introduction", "H2: Main Content", "H2: Conclusion"]
    
    def _generate_article(self, keyword: str, outline: List[str], word_count: int) -> str:
        """Generate full article content"""
        
        prompt = f"""Write a comprehensive, SEO-optimized blog post.

Target Keyword: "{keyword}"
Target Length: {word_count} words
Outline:
{chr(10).join(outline)}

Content Requirements:
- Engaging introduction with hook
- Natural keyword usage (1-2% density)
- Use transition words and varied sentence structure
- Include examples and real-world applications
- Conversational, friendly tone
- Actionable tips and steps
- Strong call-to-action at the end
- Link suggestions (write as [link: anchor text])

Write the FULL article now. Make it informative, engaging, and valuable."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            article = message.content[0].text.strip()
            return article
            
        except Exception as e:
            print(f"  ⚠️ Article generation error: {e}")
            return f"# {keyword.title()}\n\nArticle content here..."
    
    def _generate_meta_data(self, keyword: str, article: str) -> Dict:
        """Generate SEO meta data"""
        
        prompt = f"""Create SEO meta data for this article about "{keyword}".

Article excerpt: {article[:500]}...

Generate:
1. Title tag (50-60 characters, include keyword)
2. Meta description (150-160 characters, include keyword, compelling CTA)

Return as:
TITLE: [your title]
DESCRIPTION: [your description]"""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response = message.content[0].text.strip()
            
            title = ""
            description = ""
            for line in response.split('\n'):
                if line.startswith('TITLE:'):
                    title = line.replace('TITLE:', '').strip()
                elif line.startswith('DESCRIPTION:'):
                    description = line.replace('DESCRIPTION:', '').strip()
            
            return {'title': title, 'description': description}
            
        except Exception as e:
            return {
                'title': f"{keyword.title()} - Complete Guide",
                'description': f"Learn everything about {keyword}. Step-by-step guide with tips and examples."
            }
    
    def _suggest_internal_links(self, keyword: str) -> List[str]:
        """Suggest internal linking opportunities"""
        suggestions = [
            "/templates - Browse our template collection",
            "/examples - See example pages",
            "/create - Start creating your page",
            "/blog - Related articles"
        ]
        return suggestions
    
    def _suggest_images(self, outline: List[str]) -> List[str]:
        """Suggest images needed for article"""
        h2_sections = [line for line in outline if line.startswith('H2:')]
        return [f"Feature image for: {section}" for section in h2_sections[:5]]
    
    def generate_template_landing_pages(self):
        """Generate SEO landing pages for each template"""
        
        print("\n🎨 Generating template landing pages...")
        
        # Get templates from your database/config
        templates = [
            {"id": "romantic-birthday", "name": "Romantic Birthday Page"},
            {"id": "anniversary-love", "name": "Anniversary Heartful Page"},
            {"id": "valentine-special", "name": "Valentine's Day Special"},
            {"id": "proposal-page", "name": "Proposal Page"},
            {"id": "wedding-invitation", "name": "Wedding Invitation Page"}
        ]
        
        for template in templates:
            print(f"\n  Creating landing page for: {template['name']}")
            
            landing_page = self._generate_template_landing_page(template)
            
            # Save
            safe_name = template['id']
            output_file = Path(self.config['output']['content_directory']) / f"landing_{safe_name}.json"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(landing_page, f, indent=2, ensure_ascii=False)
            
            print(f"    ✓ Saved: {output_file}")
            time.sleep(1)
    
    def _generate_template_landing_page(self, template: Dict) -> Dict:
        """Generate landing page for template"""
        
        if not self.ai_client:
            return self._fallback_landing_page(template)
        
        prompt = f"""Create SEO-optimized landing page content for: "{template['name']}"

Generate:
1. H1 Title (include template name + benefit)
2. Hero description (2-3 sentences, compelling)
3. Feature list (5-7 key features/benefits)
4. Use cases (3-4 scenarios where this template shines)
5. CTA text
6. Meta description (150-160 chars)

Format as JSON."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Try to parse JSON from response
            response_text = message.content[0].text.strip()
            
            # Extract JSON if wrapped in markdown
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            return self._fallback_landing_page(template)
            
        except:
            return self._fallback_landing_page(template)
    
    def _fallback_landing_page(self, template: Dict) -> Dict:
        """Fallback landing page content"""
        return {
            'title': f"Create Beautiful {template['name']} - Easy & Fast",
            'hero_description': f"Make your {template['name'].lower()} truly special with our stunning template. Personalize with your photos, messages, and love story.",
            'features': [
                "Easy drag-and-drop customization",
                "Beautiful pre-designed layouts",
                "Add unlimited photos and videos",
                "Mobile-friendly and responsive",
                "Share via link instantly"
            ],
            'use_cases': [
                f"Perfect for surprising your loved one",
                f"Great for long-distance relationships",
                f"Share with family and friends"
            ],
            'cta': "Create Your Page Now",
            'meta_description': f"Create a stunning {template['name'].lower()} in minutes. Beautiful templates, easy customization, instant sharing."
        }
    
    def generate_sitemap_data(self) -> List[Dict]:
        """Generate sitemap data for all content"""
        
        print("\n🗺️ Generating sitemap data...")
        
        sitemap_urls = []
        base_url = self.config['business_info']['website']
        
        # Static pages
        static_pages = [
            {'url': f"{base_url}/", 'priority': 1.0, 'changefreq': 'daily'},
            {'url': f"{base_url}/templates", 'priority': 0.9, 'changefreq': 'weekly'},
            {'url': f"{base_url}/examples", 'priority': 0.8, 'changefreq': 'weekly'},
            {'url': f"{base_url}/pricing", 'priority': 0.9, 'changefreq': 'monthly'},
            {'url': f"{base_url}/blog", 'priority': 0.8, 'changefreq': 'daily'}
        ]
        
        sitemap_urls.extend(static_pages)
        
        print(f"✓ Generated {len(sitemap_urls)} URLs")
        
        return sitemap_urls


def main():
    """Main function"""
    print("\n" + "="*70)
    print("🔍 SEO Automation System")
    print("="*70 + "\n")
    
    seo = SEOAutomator()
    
    # Menu
    print("What would you like to do?")
    print("1. Research keywords")
    print("2. Generate blog post")
    print("3. Generate template landing pages")
    print("4. Generate sitemap data")
    print("5. Full SEO automation (all of the above)")
    
    choice = input("\nEnter choice (1-5): ").strip()
    
    if choice == '1':
        keywords = seo.research_keywords()
        print(f"\n✓ Found {len(keywords)} keywords")
        
    elif choice == '2':
        keyword = input("Enter target keyword: ").strip()
        blog_post = seo.generate_blog_post(keyword)
        print(f"\n✓ Generated {blog_post.get('word_count', 0)} word article")
        
    elif choice == '3':
        seo.generate_template_landing_pages()
        print("\n✓ Template landing pages generated")
        
    elif choice == '4':
        sitemap = seo.generate_sitemap_data()
        print(f"\n✓ Generated sitemap with {len(sitemap)} URLs")
        
    elif choice == '5':
        print("\n🚀 Running full SEO automation...\n")
        
        # 1. Keyword research
        keywords = seo.research_keywords()
        
        # 2. Generate blog posts for top keywords
        top_keywords = [k['keyword'] for k in keywords[:5]]
        for keyword in top_keywords:
            seo.generate_blog_post(keyword)
            time.sleep(2)
        
        # 3. Template landing pages
        seo.generate_template_landing_pages()
        
        # 4. Sitemap
        seo.generate_sitemap_data()
        
        print("\n✅ Full SEO automation complete!")


if __name__ == "__main__":
    main()

