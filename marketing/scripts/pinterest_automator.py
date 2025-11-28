"""
Pinterest Automation for Template Marketing
Automates pin creation and scheduling for maximum reach
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List
import time

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import requests
except ImportError as e:
    print(f"Missing dependency: {e}")
    exit(1)


class PinterestAutomator:
    """Automate Pinterest marketing for templates"""
    
    def __init__(self, config_path: str = "config.json"):
        self.config = self._load_config(config_path)
        self._setup_directories()
        
        # Pinterest-specific settings
        self.pin_size = (1000, 1500)  # Optimal Pinterest size
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration"""
        if not os.path.exists(config_path):
            config_path = "config.example.json"
        
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def _setup_directories(self):
        """Create output directories"""
        pinterest_dir = Path(self.config['output']['images_directory']) / 'pinterest'
        pinterest_dir.mkdir(parents=True, exist_ok=True)
        
        schedules_dir = Path(self.config['output']['schedules_directory'])
        schedules_dir.mkdir(parents=True, exist_ok=True)
    
    def create_pinterest_pin(
        self, 
        template_name: str, 
        template_description: str,
        template_image_path: str = None,
        style: str = "romantic"
    ) -> str:
        """Create optimized Pinterest pin"""
        
        print(f"📌 Creating Pinterest pin for: {template_name}")
        
        # Create pin image
        pin = Image.new('RGB', self.pin_size, color=(255, 255, 255))
        draw = ImageDraw.Draw(pin)
        
        # Color schemes for different styles
        color_schemes = {
            'romantic': {
                'bg_top': (255, 192, 203),
                'bg_bottom': (255, 105, 180),
                'text': (255, 255, 255),
                'accent': (255, 20, 147)
            },
            'elegant': {
                'bg_top': (147, 112, 219),
                'bg_bottom': (75, 0, 130),
                'text': (255, 255, 255),
                'accent': (186, 85, 211)
            },
            'modern': {
                'bg_top': (255, 182, 193),
                'bg_bottom': (255, 105, 180),
                'text': (60, 60, 60),
                'accent': (255, 20, 147)
            }
        }
        
        colors = color_schemes.get(style, color_schemes['romantic'])
        
        # Create gradient background
        for y in range(self.pin_size[1]):
            ratio = y / self.pin_size[1]
            color = tuple(
                int(colors['bg_top'][i] + (colors['bg_bottom'][i] - colors['bg_top'][i]) * ratio)
                for i in range(3)
            )
            draw.rectangle([(0, y), (self.pin_size[0], y + 1)], fill=color)
        
        # Add template preview if available
        preview_height = 800
        if template_image_path and os.path.exists(template_image_path):
            try:
                template_img = Image.open(template_image_path)
                # Resize to fit
                template_img.thumbnail((900, preview_height), Image.Resampling.LANCZOS)
                
                # Center and paste
                x = (self.pin_size[0] - template_img.width) // 2
                y = 200
                
                # Add shadow effect
                pin.paste(template_img, (x, y))
            except Exception as e:
                print(f"  ⚠️ Could not add template preview: {e}")
        
        # Add text overlay
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
            subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 50)
            cta_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            cta_font = ImageFont.load_default()
        
        # Add title at top
        title_text = template_name.upper()
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        
        # Text with shadow for better visibility
        shadow_offset = 3
        title_x = (self.pin_size[0] - title_width) // 2
        title_y = 50
        
        # Shadow
        draw.text((title_x + shadow_offset, title_y + shadow_offset), title_text, fill=(0, 0, 0, 128), font=title_font)
        # Text
        draw.text((title_x, title_y), title_text, fill=colors['text'], font=title_font)
        
        # Add CTA at bottom
        cta_text = "✨ Create Yours Now ✨"
        cta_bbox = draw.textbbox((0, 0), cta_text, font=cta_font)
        cta_width = cta_bbox[2] - cta_bbox[0]
        cta_x = (self.pin_size[0] - cta_width) // 2
        cta_y = self.pin_size[1] - 150
        
        # CTA background
        padding = 30
        cta_bg_box = [
            cta_x - padding,
            cta_y - padding,
            cta_x + cta_width + padding,
            cta_y + 80
        ]
        draw.rounded_rectangle(cta_bg_box, radius=20, fill=colors['accent'])
        
        # CTA text
        draw.text((cta_x, cta_y), cta_text, fill=colors['text'], font=cta_font)
        
        # Add decorative elements
        self._add_decorative_hearts(draw, colors['accent'])
        
        # Add watermark
        watermark = self.config['business_info']['name']
        watermark_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        watermark_bbox = draw.textbbox((0, 0), watermark, font=watermark_font)
        watermark_width = watermark_bbox[2] - watermark_bbox[0]
        watermark_x = (self.pin_size[0] - watermark_width) // 2
        watermark_y = self.pin_size[1] - 50
        draw.text((watermark_x, watermark_y), watermark, fill=colors['text'], font=watermark_font)
        
        # Save pin
        pinterest_dir = Path(self.config['output']['images_directory']) / 'pinterest'
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = template_name.replace(' ', '_').lower()
        pin_path = pinterest_dir / f"pin_{safe_name}_{timestamp}.png"
        
        pin.save(pin_path, quality=95, optimize=True)
        print(f"  ✓ Pin created: {pin_path}")
        
        return str(pin_path)
    
    def _add_decorative_hearts(self, draw, color):
        """Add decorative heart elements"""
        heart_positions = [
            (100, 150), (850, 200), (120, 1300), (880, 1350),
            (50, 700), (920, 750)
        ]
        
        for x, y in heart_positions:
            size = 40
            # Simple heart using text emoji
            try:
                emoji_font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", size)
                draw.text((x, y), "❤️", font=emoji_font, embedded_color=True)
            except:
                # Fallback: draw circles
                draw.ellipse([x, y, x + size, y + size], fill=color + (150,))
    
    def generate_pin_description(self, template_name: str, template_type: str) -> Dict:
        """Generate Pinterest pin description with keywords"""
        
        # Pinterest SEO keywords
        keywords = {
            'romantic': ['romantic', 'love', 'couples', 'relationship goals', 'date night'],
            'birthday': ['birthday', 'celebration', 'gift ideas', 'surprise', 'special day'],
            'anniversary': ['anniversary', 'milestone', 'years together', 'love story'],
            'proposal': ['proposal', 'engagement', 'will you marry me', 'ring', 'forever'],
            'valentine': ['valentines day', 'romance', 'hearts', 'love day', 'february 14']
        }
        
        relevant_keywords = keywords.get(template_type.lower(), keywords['romantic'])
        
        # Create description
        description = f"❤️ {template_name} - Create a stunning personalized page for your loved one! "
        description += f"Perfect for {', '.join(relevant_keywords[:3])}. "
        description += "✨ Easy to customize, beautiful templates, instant sharing. "
        description += "Make moments memorable! 💕"
        
        # Add hashtags (Pinterest loves them)
        hashtags = [
            f"#{kw.replace(' ', '')}" for kw in relevant_keywords
        ]
        hashtags.extend(['#LoveGifts', '#PersonalizedGifts', '#RomanticIdeas', '#DigitalGift'])
        
        return {
            'title': f"{template_name} | Create Your Own",
            'description': description,
            'hashtags': hashtags[:10],
            'link': f"{self.config['business_info']['website']}/templates/{template_name.lower().replace(' ', '-')}"
        }
    
    def create_pins_for_all_templates(self) -> List[Dict]:
        """Create Pinterest pins for all templates"""
        
        print("\n" + "="*70)
        print("📌 Creating Pinterest Pins for All Templates")
        print("="*70 + "\n")
        
        # Template definitions
        templates = [
            {
                'name': 'Romantic Birthday Page',
                'type': 'birthday',
                'description': 'Perfect birthday surprise for your loved one',
                'style': 'romantic'
            },
            {
                'name': 'Anniversary Love Story',
                'type': 'anniversary',
                'description': 'Celebrate your journey together',
                'style': 'elegant'
            },
            {
                'name': 'Valentine Special',
                'type': 'valentine',
                'description': 'Express your love this Valentine\'s Day',
                'style': 'romantic'
            },
            {
                'name': 'Proposal Page',
                'type': 'proposal',
                'description': 'Pop the question in style',
                'style': 'elegant'
            },
            {
                'name': 'Love Letter Digital',
                'type': 'romantic',
                'description': 'Modern love letters for modern couples',
                'style': 'modern'
            },
            {
                'name': 'Memory Timeline',
                'type': 'anniversary',
                'description': 'Showcase your beautiful memories',
                'style': 'elegant'
            },
            {
                'name': 'Long Distance Love',
                'type': 'romantic',
                'description': 'Bridge the distance with love',
                'style': 'romantic'
            },
            {
                'name': 'Wedding Invitation',
                'type': 'wedding',
                'description': 'Stunning digital wedding invites',
                'style': 'elegant'
            }
        ]
        
        all_pins = []
        
        for i, template in enumerate(templates, 1):
            print(f"\n[{i}/{len(templates)}] {template['name']}")
            
            # Create pin image
            pin_path = self.create_pinterest_pin(
                template['name'],
                template['description'],
                style=template['style']
            )
            
            # Generate description
            pin_data = self.generate_pin_description(
                template['name'],
                template['type']
            )
            
            # Combine
            pin_info = {
                'template_id': template['name'].lower().replace(' ', '_'),
                'template_name': template['name'],
                'template_type': template['type'],
                'pin_image': pin_path,
                'title': pin_data['title'],
                'description': pin_data['description'],
                'hashtags': pin_data['hashtags'],
                'link': pin_data['link'],
                'created_at': datetime.now().isoformat(),
                'status': 'ready'
            }
            
            all_pins.append(pin_info)
            
            print(f"  ✓ Pin ready!")
            time.sleep(0.5)
        
        # Save pins data
        pins_file = Path(self.config['output']['schedules_directory']) / f"pinterest_pins_{datetime.now().strftime('%Y%m%d')}.json"
        with open(pins_file, 'w', encoding='utf-8') as f:
            json.dump(all_pins, f, indent=2, ensure_ascii=False)
        
        print(f"\n{'='*70}")
        print(f"✅ Created {len(all_pins)} Pinterest pins")
        print(f"💾 Data saved to: {pins_file}")
        print(f"{'='*70}\n")
        
        return all_pins
    
    def create_posting_schedule(self, pins: List[Dict], days: int = 7) -> List[Dict]:
        """Create Pinterest posting schedule"""
        
        print(f"\n📅 Creating {days}-day posting schedule...")
        
        pinterest_config = self.config['social_media']['pinterest']
        daily_pins = pinterest_config['daily_pins']
        best_times = pinterest_config['best_times']
        
        schedule = []
        pin_index = 0
        
        for day in range(days):
            date = datetime.now() + timedelta(days=day)
            date_str = date.strftime('%Y-%m-%d')
            
            for time_slot in best_times[:daily_pins]:
                if pin_index >= len(pins):
                    pin_index = 0  # Loop back
                
                pin = pins[pin_index]
                
                schedule_item = {
                    'date': date_str,
                    'time': time_slot,
                    'datetime': f"{date_str} {time_slot}",
                    'pin_id': pin['template_id'],
                    'title': pin['title'],
                    'description': pin['description'],
                    'image': pin['pin_image'],
                    'link': pin['link'],
                    'hashtags': ' '.join(pin['hashtags']),
                    'board': pinterest_config['boards'][0],
                    'status': 'scheduled'
                }
                
                schedule.append(schedule_item)
                pin_index += 1
        
        # Save schedule
        schedule_file = Path(self.config['output']['schedules_directory']) / f"pinterest_schedule_{datetime.now().strftime('%Y%m%d')}.json"
        with open(schedule_file, 'w', encoding='utf-8') as f:
            json.dump(schedule, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Created schedule with {len(schedule)} pins")
        print(f"✓ Saved to: {schedule_file}")
        
        # Also create CSV for manual upload
        self._export_schedule_csv(schedule)
        
        return schedule
    
    def _export_schedule_csv(self, schedule: List[Dict]):
        """Export schedule as CSV for Buffer/Publer"""
        
        try:
            import csv
            
            csv_file = Path(self.config['output']['schedules_directory']) / f"pinterest_schedule_{datetime.now().strftime('%Y%m%d')}.csv"
            
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=[
                    'datetime', 'title', 'description', 'image', 'link', 'hashtags', 'board'
                ])
                writer.writeheader()
                
                for item in schedule:
                    writer.writerow({
                        'datetime': item['datetime'],
                        'title': item['title'],
                        'description': item['description'],
                        'image': item['image'],
                        'link': item['link'],
                        'hashtags': item['hashtags'],
                        'board': item['board']
                    })
            
            print(f"✓ CSV exported: {csv_file}")
            print(f"  → Import this into Buffer or Publer for scheduling!")
            
        except Exception as e:
            print(f"⚠️ CSV export failed: {e}")
    
    def create_idea_pins_content(self, topic: str) -> Dict:
        """Create content for Pinterest Idea Pins (multi-page)"""
        
        print(f"\n💡 Creating Idea Pin content for: {topic}")
        
        # Idea pins have multiple pages (2-20)
        pages = [
            {
                'page': 1,
                'type': 'cover',
                'text': f"❤️ {topic}",
                'style': 'bold_title'
            },
            {
                'page': 2,
                'type': 'tip',
                'text': "Here's why this matters...",
                'style': 'text_heavy'
            },
            {
                'page': 3,
                'type': 'example',
                'text': "See it in action!",
                'style': 'image_focus'
            },
            {
                'page': 4,
                'type': 'cta',
                'text': "Create yours now!",
                'style': 'call_to_action'
            }
        ]
        
        idea_pin = {
            'topic': topic,
            'pages': pages,
            'total_pages': len(pages),
            'description': f"Learn how to {topic.lower()} with our easy guide! 💕",
            'created_at': datetime.now().isoformat()
        }
        
        print(f"✓ Idea Pin structure created ({len(pages)} pages)")
        
        return idea_pin


def main():
    """Main function"""
    print("\n" + "="*70)
    print("📌 Pinterest Automation System")
    print("="*70 + "\n")
    
    automator = PinterestAutomator()
    
    print("What would you like to do?")
    print("1. Create pins for all templates")
    print("2. Create posting schedule")
    print("3. Full Pinterest automation (both)")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == '1':
        pins = automator.create_pins_for_all_templates()
        print(f"\n✅ Created {len(pins)} pins!")
        
    elif choice == '2':
        # Load existing pins
        pins_file = list(Path(automator.config['output']['schedules_directory']).glob('pinterest_pins_*.json'))
        if pins_file:
            with open(pins_file[-1], 'r') as f:
                pins = json.load(f)
            
            days = int(input("How many days to schedule? (default 7): ") or "7")
            schedule = automator.create_posting_schedule(pins, days)
            print(f"\n✅ Created {days}-day schedule with {len(schedule)} posts!")
        else:
            print("❌ No pins found. Run option 1 first!")
        
    elif choice == '3':
        print("\n🚀 Running full Pinterest automation...\n")
        
        # Create all pins
        pins = automator.create_pins_for_all_templates()
        
        # Create schedule
        schedule = automator.create_posting_schedule(pins, days=14)
        
        print("\n✅ Full Pinterest automation complete!")
        print(f"   - {len(pins)} pins created")
        print(f"   - {len(schedule)} posts scheduled")
        print(f"\n📁 Check the '{automator.config['output']['schedules_directory']}' directory")


if __name__ == "__main__":
    main()

