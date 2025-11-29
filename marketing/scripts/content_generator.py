"""
AI-Powered Content Generator for Social Media
Generates diverse, engaging content for heartful pages business
"""

import json
import os
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
import time

try:
    from anthropic import Anthropic
    from PIL import Image, ImageDraw, ImageFont
    import requests
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Run: pip install -r requirements.txt")
    exit(1)


class ContentGenerator:
    """Generate AI-powered content for social media"""
    
    def __init__(self, config_path: str = "config.json"):
        self.config = self._load_config(config_path)
        self.ai_client = self._init_ai_client()
        self._setup_directories()
        
        # Romantic niche specific emojis
        self.emojis = {
            'romantic': [
                '❤️', '💕', '💖', '💝', '💗', '💓', '💞', '🌹', '💑', '💏', '😍', '🥰',
                '🫶', '😘', '🫂', '🥀', '💟', '👩‍❤️‍👨', '👩‍❤️‍👩', '👨‍❤️‍👨', '🌷', '💘', '💍', '🩷'
            ],
            'celebration': [
                '🎉', '🎊', '🎂', '🎈', '✨', '💫', '🎁', '🌟', '🥳', '🍾', '🎶', '🍰',
                '🎀', '🧁', '🪅', '🥂', '🎵', '🍬'
            ],
            'love': [
                '💌', '💘', '😘', '🌺', '🌸', '💐', '🦋', '💋', '💍', '💑', '🫂', '👩‍❤️‍👨', 
                '❤‍🔥', '💞', '💕', '🌼', '💚', '💙', '💛', '💜'
            ],
            'engagement': [
                '👇', '💭', '❓', '👀', '🔥', '💯', '🗨️', '📣', '🔔', '💬', '🙌', 
                '🤔', '🤩', '🤳', '🗳️', '📢'
            ],
            'wedding': [
                '👰‍♀️', '🤵‍♂️', '💍', '👑', '💒', '🎩', '👗', '💐', '🥂', '🎂', '💖'
            ],
            'nature': [
                '🌅', '🌄', '🌠', '🌸', '🍃', '🍂', '🌿', '🌻', '🌼', '🌺', '🍀'
            ],
            'friendship': [
                '🤗', '👫', '👬', '👭', '🧑‍🤝‍🧑', '🤝', '💛', '🌟', '🤩'
            ],
            'gratitude': [
                '🙏', '🤍', '😊', '😇', '🙌', '🌹', '💝', '✨'
            ],
            'anniversary': [
                '🎊', '🥂', '💑', '🎂', '💍', '🎁', '🏆', '🌹', '💓', '⭐'
            ],
            'birthday': [
                '🎈', '🎂', '🎁', '🧁', '🍰', '🥳', '🎉', '🌟', '🍬', '🍾', '✨'
            ],
            'motivational': [
                '🌟', '🚀', '🔥', '🏆', '💪', '🤩', '🌈', '✨', '🙌'
            ],
            'seasonal': [
                '🎄', '❄️', '☃️', '🎅', '🌸', '🌞', '🍁', '🍂', '🌻', '🌊'
            ],
            'family': [
                '👨‍👩‍👧‍👦', '👩‍👧‍👦', '👨‍👧', '👩‍👧', '🧑‍🧑‍🧒', '👨‍👦', '👩‍👧‍👦', '🫶', '❤️'
            ]
        }
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration file"""
        if not os.path.exists(config_path):
            config_path = "config.example.json"
        
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Config file not found. Please create config.json from config.example.json")
            exit(1)
    
    def _init_ai_client(self):
        """Initialize AI client (Anthropic Claude)"""
        api_key = self.config.get('anthropic_api_key')
        if not api_key or api_key == "YOUR_ANTHROPIC_API_KEY":
            print("⚠️ Warning: Anthropic API key not configured. Using fallback content generation.")
            return None
        
        try:
            return Anthropic(api_key=api_key)
        except Exception as e:
            print(f"⚠️ AI client initialization failed: {e}")
            return None
    
    def _setup_directories(self):
        """Create output directories"""
        for dir_key in ['content_directory', 'images_directory', 'reports_directory', 'schedules_directory']:
            dir_path = Path(self.config['output'][dir_key])
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def generate_caption(self, topic: str, style: str = "romantic", length: str = "medium") -> str:
        """Generate AI-powered caption"""
        
        if not self.ai_client:
            return self._fallback_caption(topic, style)
        
        business = self.config['business_info']
        
        length_guide = {
            "short": "50-100 characters",
            "medium": "150-200 characters",
            "long": "250-300 characters"
        }
        
        prompt = f"""Generate a {style} social media caption for: "{topic}"

Business Context:
- Brand: {business['name']}
- Niche: {business['niche']}
- Audience: {business['target_audience']}
- Tone: {business['tone']}

Requirements:
- Length: {length_guide.get(length, '150-200 characters')}
- Include 3-5 relevant emojis
- Create an emotional hook in the first sentence
- End with a question or call-to-action to boost engagement
- Make it shareable and relatable
- Focus on emotions and relationships

Return ONLY the caption text, no explanations."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            caption = message.content[0].text.strip()
            return caption
            
        except Exception as e:
            print(f"⚠️ AI generation error: {e}")
            return self._fallback_caption(topic, style)
    
    def _fallback_caption(self, topic: str, style: str) -> str:
        """Fallback caption when AI is unavailable"""
        templates = {
            'romantic': [
                f"❤️ {topic}... because love deserves to be celebrated in the most special way! 💕 What's your love story? 👇",
                f"💖 Every moment matters when it comes to {topic}. Make yours unforgettable! ✨ Tag someone special! 💑",
                f"💝 {topic} - the perfect way to show how much you care! 🌹 Who are you creating this for? 😍"
            ],
            'inspirational': [
                f"✨ {topic} reminds us why love is the greatest gift of all. 💕 Share this with someone who needs it! 👇",
                f"💫 In a world full of ordinary, make your {topic} extraordinary! 🌟 Who inspires you? ❤️"
            ],
            'promotional': [
                f"🎁 Create a stunning {topic} in minutes! Perfect for that special someone. 💖 Try it now! 👆",
                f"💕 Turn your {topic} into something magical with our beautiful templates! ✨ Start creating! 🎨"
            ]
        }
        
        options = templates.get(style, templates['romantic'])
        return random.choice(options)
    
    def generate_caption_variations(self, topic: str, count: int = 3) -> List[Dict]:
        """Generate multiple caption variations for A/B testing"""
        
        styles = ['romantic', 'inspirational', 'emotional']
        variations = []
        
        for i, style in enumerate(styles[:count]):
            caption = self.generate_caption(topic, style)
            
            variations.append({
                'id': i + 1,
                'style': style,
                'caption': caption,
                'length': len(caption),
                'emoji_count': sum(1 for c in caption if c in ''.join([e for emojis in self.emojis.values() for e in emojis]))
            })
        
        return variations
    
    def generate_hashtags(self, topic: str, count: int = 8) -> List[str]:
        """Generate relevant hashtags"""
        
        if not self.ai_client:
            return self._fallback_hashtags(topic, count)
        
        prompt = f"""Generate {count} relevant, popular hashtags for: "{topic}"

Context: Romantic digital pages, love messages, anniversary gifts

Requirements:
- Mix of niche-specific and broad hashtags
- Include # symbol
- No spaces in hashtags
- Mix of trending and evergreen tags
- Include variations like #LoveStory #LoveStories

Example format: #RomanticGifts #AnniversaryIdeas #LoveMessages

Return only the hashtags separated by spaces."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response = message.content[0].text.strip()
            hashtags = [tag.strip() for tag in response.split() if tag.startswith('#')]
            return hashtags[:count]
            
        except Exception as e:
            print(f"⚠️ Hashtag generation error: {e}")
            return self._fallback_hashtags(topic, count)
    
    def _fallback_hashtags(self, topic: str, count: int) -> List[str]:
        """Fallback hashtags"""
        base_tags = [
            '#Love', '#Romance', '#Anniversary', '#Romantic', '#LoveStory',
            '#CoupleGoals', '#RelationshipGoals', '#LoveYou', '#ForeverLove',
            '#RomanticGifts', '#LoveMessage', '#DigitalArt', '#Personalized',
            '#GiftIdeas', '#BirthdayLove', '#ValentinesDay', '#SpecialMoments'
        ]
        
        # Add topic-specific tags
        topic_words = topic.lower().replace(' ', '').split()
        topic_tags = [f"#{word.capitalize()}" for word in topic_words if len(word) > 3]
        
        all_tags = topic_tags + base_tags
        random.shuffle(all_tags)
        return all_tags[:count]
    
    def create_image(self, text: str, template_style: str = "romantic", size: tuple = (1080, 1080)) -> str:
        """Generate branded social media image"""
        
        output_dir = Path(self.config['output']['images_directory'])
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_path = output_dir / f"post_{timestamp}.png"
        
        # Color schemes based on style
        color_schemes = {
            'romantic': {
                'bg_colors': [(255, 192, 203), (255, 105, 180), (219, 112, 147)],
                'text_color': (255, 255, 255),
                'accent': (255, 20, 147)
            },
            'elegant': {
                'bg_colors': [(147, 112, 219), (138, 43, 226), (75, 0, 130)],
                'text_color': (255, 255, 255),
                'accent': (186, 85, 211)
            },
            'modern': {
                'bg_colors': [(255, 105, 180), (255, 182, 193), (255, 192, 203)],
                'text_color': (60, 60, 60),
                'accent': (255, 20, 147)
            }
        }
        
        scheme = color_schemes.get(template_style, color_schemes['romantic'])
        
        # Create image
        img = Image.new('RGB', size, color=scheme['bg_colors'][0])
        draw = ImageDraw.Draw(img)
        
        # Create gradient background
        for i in range(size[1]):
            ratio = i / size[1]
            color = tuple(
                int(scheme['bg_colors'][0][j] + (scheme['bg_colors'][1][j] - scheme['bg_colors'][0][j]) * ratio)
                for j in range(3)
            )
            draw.rectangle([(0, i), (size[0], i + 1)], fill=color)
        
        # Add decorative elements
        self._add_decorative_hearts(draw, size, scheme['accent'])
        
        # Add text
        self._add_wrapped_text(draw, text, size, scheme['text_color'])
        
        # Add brand logo/name
        business_name = self.config['business_info']['name']
        self._add_brand_watermark(draw, business_name, size, scheme['text_color'])
        
        img.save(image_path)
        print(f"✓ Image created: {image_path}")
        return str(image_path)
    
    def _add_decorative_hearts(self, draw, size, color):
        """Add decorative heart shapes"""
        for _ in range(5):
            x = random.randint(50, size[0] - 100)
            y = random.randint(50, size[1] - 100)
            heart_size = random.randint(30, 60)
            
            # Simple heart shape using circles and triangle
            draw.ellipse([x, y, x + heart_size, y + heart_size], fill=color + (100,))
            draw.ellipse([x + heart_size//2, y, x + heart_size*1.5, y + heart_size], fill=color + (100,))
    
    def _add_wrapped_text(self, draw, text, size, color):
        """Add word-wrapped text to image"""
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        # Word wrap
        max_width = size[0] - 150
        words = text[:200].split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            test_line = ' '.join(current_line)
            bbox = draw.textbbox((0, 0), test_line, font=small_font)
            
            if bbox[2] - bbox[0] > max_width:
                current_line.pop()
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Draw centered text
        y = size[1] // 2 - (len(lines) * 60) // 2
        for line in lines[:5]:
            bbox = draw.textbbox((0, 0), line, font=small_font)
            w = bbox[2] - bbox[0]
            x = (size[0] - w) // 2
            draw.text((x, y), line, fill=color, font=small_font)
            y += 70
    
    def _add_brand_watermark(self, draw, brand_name, size, color):
        """Add brand watermark"""
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 45)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), brand_name, font=font)
        w = bbox[2] - bbox[0]
        x = (size[0] - w) // 2
        y = 100
        
        draw.text((x, y), brand_name, fill=color, font=font)
    
    def generate_post_topics(self, count: int = 10) -> List[str]:
        """Generate post topics for the day"""
        
        if not self.ai_client:
            return self._fallback_topics(count)
        
        niche = self.config['business_info']['niche']
        audience = self.config['business_info']['target_audience']
        
        prompt = f"""Generate {count} engaging post topics for a social media campaign.

Business: Romantic digital pages and love messages
Niche: {niche}
Target Audience: {audience}

Topic Categories (mix these):
1. Emotional storytelling (love stories, memorable moments)
2. Tips and advice (relationship tips, gift ideas)
3. Inspirational quotes (about love and relationships)
4. Product showcases (template examples)
5. User engagement (questions, polls, challenges)
6. Seasonal/trending (holidays, awareness days)

Requirements:
- Each topic should be 3-8 words
- Make them emotionally engaging
- Varied content types
- Some should inspire immediate action
- Mix educational and entertainment

Return one topic per line, no numbers or bullets."""

        try:
            message = self.ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}]
            )
            
            topics = [line.strip() for line in message.content[0].text.strip().split('\n') if line.strip()]
            topics = [t.strip('- 0123456789.') for t in topics]
            return topics[:count]
            
        except Exception as e:
            print(f"⚠️ Topic generation error: {e}")
            return self._fallback_topics(count)
    
    def _fallback_topics(self, count: int) -> List[str]:
        """Fallback topics"""
        topics = [
            "Why personalized gifts matter most",
            "Love languages and digital expressions",
            "Anniversary surprise ideas that work",
            "Creating memorable birthday moments",
            "The art of romantic gestures",
            "Long distance relationship gift ideas",
            "Proposal ideas that wow",
            "Celebrating love milestones",
            "DIY heartful page tutorials",
            "Love story inspiration",
            "Valentine's Day alternatives",
            "Thoughtful gift ideas for partners",
            "Making ordinary days special",
            "Digital love letters explained",
            "Romantic template showcase",
            "How to choose the perfect photo for your page",
            "Best quotes about everlasting love",
            "Tips for planning a memorable anniversary",
            "Birthdays as new chapters in love stories",
            "User favorite memory highlights",
            "Creative ways to say 'I love you' online",
            "Secrets to keeping romance alive long-distance",
            "Proposal stories: Community highlights",
            "Honoring milestones: Anniversaries and beyond",
            "Gift ideas for every relationship stage",
            "Spotlight: Real love stories from our users",
            "Design a page together: Couple challenge",
            "Making birthdays feel magical",
            "Anniversary traditions from around the world",
            "Digital moments that last forever",
            "From first date to forever: Milestone map",
            "Top ten romantic gestures in 2024",
            "Winter romance ideas for couples",
            "Why digital keepsakes make meaningful gifts",
            "Valentine’s Day: Beyond the roses",
            "Cherishing everyday moments with your partner",
            "How to write an emotional message",
            "Planning the ultimate surprise for them",
            "Celebrating love through music and memories",
            "Favorite love songs for your special page",
            "Meaningful ways to mark milestones online",
            "Best practices for group love letters",
            "New features: What’s possible with our templates",
            "Monthly couple's challenge: Share your story",
            "How your love story inspires the world",
        ]
        random.shuffle(topics)
        return topics[:count]
    
    def generate_daily_content_batch(self, date: str = None) -> Dict:
        """Generate full day's content"""
        
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        print(f"\n{'='*70}")
        print(f"🎨 Generating Content Batch for {date}")
        print(f"{'='*70}\n")
        
        strategy = self.config['content_strategy']
        post_count = strategy['daily_content_count']
        
        # Generate topics
        print(f"📝 Generating {post_count} post topics...")
        topics = self.generate_post_topics(post_count)
        
        batch = {
            'date': date,
            'generated_at': datetime.now().isoformat(),
            'posts': []
        }
        
        for i, topic in enumerate(topics, 1):
            print(f"\n[{i}/{post_count}] Creating post: '{topic}'")
            
            # Generate caption variations
            print("  ↳ Generating caption variations...")
            variations = self.generate_caption_variations(topic, count=3)
            
            # Generate hashtags
            print("  ↳ Generating hashtags...")
            hashtags = self.generate_hashtags(topic, count=strategy['hashtag_count'])
            
            # Create image
            print("  ↳ Creating image...")
            best_caption = variations[0]['caption']
            image_path = self.create_image(best_caption, template_style='romantic')
            
            # Compile post
            post = {
                'id': f"{date}_{i}",
                'topic': topic,
                'variations': variations,
                'recommended_caption': best_caption,
                'hashtags': hashtags,
                'full_post': f"{best_caption}\n\n{' '.join(hashtags)}",
                'image_path': image_path,
                'created_at': datetime.now().isoformat(),
                'status': 'ready'
            }
            
            batch['posts'].append(post)
            print(f"  ✓ Post #{i} ready!")
            
            # Small delay to avoid rate limits
            time.sleep(0.5)
        
        # Save batch
        output_dir = Path(self.config['output']['content_directory'])
        output_file = output_dir / f"content_batch_{date}.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(batch, f, indent=2, ensure_ascii=False)
        
        print(f"\n{'='*70}")
        print(f"✅ Content batch saved: {output_file}")
        print(f"📊 Generated {len(batch['posts'])} posts")
        print(f"{'='*70}\n")
        
        return batch


def main():
    """Main function"""
    print("\n" + "="*70)
    print("🎨 AI Content Generator for Heartful Pages")
    print("="*70 + "\n")
    
    generator = ContentGenerator()
    
    # Generate content for today
    batch = generator.generate_daily_content_batch()
    
    print(f"\n✨ Successfully generated {len(batch['posts'])} posts!")
    print(f"📁 Check the 'generated_content' directory for your content.")
    print(f"\nNext steps:")
    print("  1. Review the generated content")
    print("  2. Use the posting assistant to schedule posts")
    print("  3. Track performance and optimize")


if __name__ == "__main__":
    main()

