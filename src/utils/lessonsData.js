// Lessons and Quizzes Data for the 5 MVP SDGs
// SDG 3: Good Health, SDG 6: Clean Water, SDG 12: Responsible Consumption, SDG 13: Climate Action, SDG 15: Life on Land

export const LESSONS_DATA = [
  {
    sdgId: 6,
    sdgNumber: 6,
    title: 'Clean Water & Sanitation',
    childTitle: 'Sparkling Clean Water',
    tagline: 'Learn how every single drop matters for our planet!',
    icon: '💧',
    themeColor: '#26BDE2',
    bgColor: 'bg-cyan-500',
    lightBg: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-700',
    shortExplanation: 'Water is something every person, animal, and plant needs to stay alive and healthy. But clean, fresh water is limited on Earth! Small actions like turning off the tap make a huge splash in saving water.',
    funFacts: [
      { icon: '🌍', text: 'Less than 1% of all water on Earth is fresh and safe for humans and animals to drink!' },
      { icon: '🦷', text: 'Turning off the tap while brushing your teeth can save up to 8 gallons of clean water every day.' },
      { icon: '🐘', text: 'An elephant drinks about 50 gallons of water a day — that is a whole bathtub full!' }
    ],
    whatYouCanDo: [
      { emoji: '🚰', title: 'Tap Detective', desc: 'Turn off faucets completely so they do not drip water drop by drop.' },
      { emoji: '⏱️', title: 'Speedy Showers', desc: 'Take 4-to-5-minute showers instead of filling deep bubble baths.' },
      { emoji: '🌧️', title: 'Garden Rain Harvester', desc: 'Use buckets to catch rainwater for thirsty potted plants and flowers.' }
    ],
    video: {
      title: 'Where Does Our Tap Water Come From?',
      channel: 'SciShow Kids',
      duration: '4 mins',
      embedUrl: 'https://www.youtube-nocookie.com/embed/OCzYdNSJF-8'
    },
    quiz: {
      id: 'quiz_sdg_6',
      title: 'Water Saver Challenge',
      xpReward: 20,
      bonusXp: 10,
      questions: [
        {
          id: 'q6_1',
          question: 'What should you do while brushing your teeth?',
          options: [
            'Leave the tap running continuously 💦',
            'Turn the tap off until you rinse ✅',
            'Splash water on the bathroom mirror 🪞',
            'Turn the water on full blast 🌊'
          ],
          correctIndex: 1,
          explanation: 'Great job! Turning off the tap while brushing saves up to 8 gallons of water every day.'
        },
        {
          id: 'q6_2',
          question: 'How much of Earth’s water is freshwater ready to drink?',
          options: [
            'Almost all of it (99%) 🌊',
            'About half of it (50%) 💧',
            'Less than 1% — it is very precious! ✅',
            'None at all 🏜️'
          ],
          correctIndex: 2,
          explanation: 'Spot on! Most water on Earth is salty ocean water. Fresh water is rare and precious.'
        },
        {
          id: 'q6_3',
          question: 'What is a great eco-friendly way to water house plants?',
          options: [
            'Collect clean rainwater in a bucket ✅',
            'Use hot soapy sink water 🧼',
            'Water them with sugary juice 🧃',
            'Spray them with a fire hose 🚒'
          ],
          correctIndex: 0,
          explanation: 'Super smart! Rainwater is naturally chemical-free and plants love it!'
        }
      ]
    },
    missionId: 'm_water_1'
  },
  {
    sdgId: 15,
    sdgNumber: 15,
    title: 'Life on Land',
    childTitle: 'Forests & Wildlife Friends',
    tagline: 'Discover the magic of trees, soil, bees, and woodland creatures!',
    icon: '🌳',
    themeColor: '#56C02B',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    shortExplanation: 'Forests and meadows are giant living apartment buildings for millions of animals, birds, and insects. Trees clean our air, make cool shade, and give us oxygen to breathe every single day!',
    funFacts: [
      { icon: '🌲', text: 'One large oak tree can provide a home and food for over 2,000 different kinds of living creatures!' },
      { icon: '🐝', text: 'Honeybees visit about 2,000 flowers a day to help flowers make seeds and yummy fruit.' },
      { icon: '🍃', text: 'A single tree can produce enough oxygen for four people to breathe all year long!' }
    ],
    whatYouCanDo: [
      { emoji: '🌱', title: 'Plant a Seed', desc: 'Grow a flower, herb, or tree seed in a small pot on your windowsill.' },
      { emoji: '🌻', title: 'Feed Pollinators', desc: 'Plant colorful native flowers that give butterflies and bees sweet nectar.' },
      { emoji: '🚯', title: 'Trail Protector', desc: 'Never leave plastic wrappers behind in parks — always pack your trash home.' }
    ],
    video: {
      title: 'Why Do We Need Trees?',
      channel: 'SciShow Kids',
      duration: '4 mins',
      embedUrl: 'https://www.youtube-nocookie.com/embed/5I7u5FKdWGY'
    },
    quiz: {
      id: 'quiz_sdg_15',
      title: 'Forest Protector Quiz',
      xpReward: 20,
      bonusXp: 10,
      questions: [
        {
          id: 'q15_1',
          question: 'What do green leaves give humans and animals to breathe?',
          options: [
            'Fresh Oxygen ✅',
            'Smoke and dust 💨',
            'Sparkly glitter ✨',
            'Soda bubbles 🥤'
          ],
          correctIndex: 0,
          explanation: 'Awesome! Leaves use sunlight to produce fresh, clean oxygen for all living things.'
        },
        {
          id: 'q15_2',
          question: 'Why are bees and butterflies so important for nature?',
          options: [
            'They play loud music in trees 🎵',
            'They pollinate flowers so fruits and seeds can grow ✅',
            'They paint the flowers with watercolor 🎨',
            'They eat all the tree bark 🪵'
          ],
          correctIndex: 1,
          explanation: 'Exactly right! Without busy pollinators like bees, we wouldn’t have apples, berries, or chocolate!'
        },
        {
          id: 'q15_3',
          question: 'What should you do with your snack wrappers while hiking in the forest?',
          options: [
            'Bury them under pine cones 🌲',
            'Throw them into a stream 🐟',
            'Put them in your backpack and throw in a trash bin ✅',
            'Leave them on the path for birds 🐦'
          ],
          correctIndex: 2,
          explanation: 'Great eco-habit! Keeping forests trash-free keeps curious wild animals safe and healthy.'
        }
      ]
    },
    missionId: 'm_land_1'
  },
  {
    sdgId: 12,
    sdgNumber: 12,
    title: 'Responsible Consumption & Production',
    childTitle: 'Less Waste, More Wonder',
    tagline: 'Learn the superhero 3 R’s: Reduce, Reuse, and Recycle!',
    icon: '♻️',
    themeColor: '#BF8B2E',
    bgColor: 'bg-yellow-600',
    lightBg: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-800',
    shortExplanation: 'Everything we enjoy — toys, books, clothes, and yummy snacks — comes from Earth’s natural treasures. When we use things wisely and reuse containers, we keep Earth beautiful and landfill-free!',
    funFacts: [
      { icon: '🥫', text: 'Recycling one aluminum soda can saves enough electricity to power a TV for 3 full hours!' },
      { icon: '📦', text: 'Cardboard can be recycled up to 7 times before the paper fibers become too small.' },
      { icon: '🐢', text: 'Using a reusable water bottle stops hundreds of single-use plastic bottles from polluting oceans.' }
    ],
    whatYouCanDo: [
      { emoji: '📦', title: 'Cardboard Forts', desc: 'Turn empty delivery boxes into rockets, puppet theaters, or doll castles!' },
      { emoji: '🛍️', title: 'Bring Your Bag', desc: 'Take a reusable tote bag when going to the market or library.' },
      { emoji: '🍏', title: 'Clean Plate Club', desc: 'Take only what you can eat at dinner to avoid tossing good food away.' }
    ],
    video: {
      title: 'Reduce, Reuse, Recycle! How Waste Sorting Works',
      channel: 'SciShow Kids',
      duration: '4 mins',
      embedUrl: 'https://www.youtube-nocookie.com/embed/OasbYWF4_S8'
    },
    quiz: {
      id: 'quiz_sdg_12',
      title: 'Recycling Detective Quiz',
      xpReward: 20,
      bonusXp: 10,
      questions: [
        {
          id: 'q12_1',
          question: 'What are the 3 R’s of protecting our environment?',
          options: [
            'Run, Rest, Repeat 🏃',
            'Reduce, Reuse, Recycle ✅',
            'Read, Rhyme, Remember 📖',
            'Rumble, Roar, Rock 🎸'
          ],
          correctIndex: 1,
          explanation: 'Fantastic! Reduce what you use, reuse what you have, and recycle the rest!'
        },
        {
          id: 'q12_2',
          question: 'What is a fun way to "reuse" an empty cardboard cereal box?',
          options: [
            'Throw it on the lawn 🏡',
            'Turn it into a toy space robot or art storage box ✅',
            'Tear it up and throw it out the car window 🚗',
            'Use it as a dinner plate 🍽️'
          ],
          correctIndex: 1,
          explanation: 'Super creative! Upcycling boxes into crafts is tons of fun and creates zero waste.'
        },
        {
          id: 'q12_3',
          question: 'Why should we carry a reusable water bottle instead of disposable plastic bottles?',
          options: [
            'It keeps plastic trash out of our parks and oceans ✅',
            'Plastic bottles are magic and disappear forever 🪄',
            'Reusable bottles are heavier to lift 🏋️',
            'It makes water taste like soda 🥤'
          ],
          correctIndex: 0,
          explanation: 'You nailed it! One reusable water bottle can replace over 1,000 plastic bottles in its lifetime.'
        }
      ]
    },
    missionId: 'm_consumption_1'
  },
  {
    sdgId: 13,
    sdgNumber: 13,
    title: 'Climate Action',
    childTitle: 'Earth Guardian Adventure',
    tagline: 'Keep our planet cool, sunny, and smiling for future generations!',
    icon: '🌍',
    themeColor: '#3F7E44',
    bgColor: 'bg-green-700',
    lightBg: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-800',
    shortExplanation: 'Earth is wrapped in a cozy blanket of air called the atmosphere. When power plants and cars burn coal and gasoline, that blanket gets too warm. By saving electricity and planting trees, we help Earth stay balanced!',
    funFacts: [
      { icon: '☀️', text: 'The sun gives Earth more clean energy in 1 single hour than the whole world uses in an entire year!' },
      { icon: '🚴', text: 'Riding a bicycle or scooter produces ZERO greenhouse gas emissions — and it builds strong leg muscles!' },
      { icon: '💡', text: 'LED light bulbs use 80% less electricity than old-fashioned bulbs and last for years!' }
    ],
    whatYouCanDo: [
      { emoji: '💡', title: 'Light Patrol', desc: 'Turn off bedroom and hallway lights whenever you leave the room.' },
      { emoji: '🚲', title: 'Pedal Power', desc: 'Walk, cycle, or take the school bus instead of asking for short car rides.' },
      { emoji: '🔌', title: 'Unplug Vampires', desc: 'Unplug chargers and game consoles when you are not using them.' }
    ],
    video: {
      title: 'What Is Climate Change? An Earth Adventure',
      channel: 'Nat Geo Kids',
      duration: '3 mins',
      embedUrl: 'https://www.youtube-nocookie.com/embed/WkvDa944TZU'
    },
    quiz: {
      id: 'quiz_sdg_13',
      title: 'Climate Hero Quiz',
      xpReward: 20,
      bonusXp: 10,
      questions: [
        {
          id: 'q13_1',
          question: 'What is a great habit before leaving your bedroom or classroom?',
          options: [
            'Turn on every single lamp 💡',
            'Turn off the lights and fan to save energy ✅',
            'Turn up the air conditioner to maximum cold ❄️',
            'Leave the television playing for nobody 📺'
          ],
          correctIndex: 1,
          explanation: 'Spot on! Turning off lights saves electricity and keeps Earth cooler.'
        },
        {
          id: 'q13_2',
          question: 'Which way of traveling does NOT pollute the air with exhaust smoke?',
          options: [
            'Riding a bicycle or scooter ✅',
            'A giant diesel dump truck 🚛',
            'A gas-guzzling speed car 🏎️',
            'A jet airplane ✈️'
          ],
          correctIndex: 0,
          explanation: 'Terrific! Human pedal power is 100% clean and super fun!'
        },
        {
          id: 'q13_3',
          question: 'What natural power comes from the sky without making any smoke or pollution?',
          options: [
            'Coal smoke 🏭',
            'Sunshine (Solar Power) & Wind Energy ✅',
            'Burning leaves in a pile 🔥',
            'Gasoline vapor ⛽'
          ],
          correctIndex: 1,
          explanation: 'Awesome! Sunshine and wind are infinite, free, and clean power from Mother Nature.'
        }
      ]
    },
    missionId: 'm_climate_1'
  },
  {
    sdgId: 3,
    sdgNumber: 3,
    title: 'Good Health & Well-being',
    childTitle: 'Happy & Healthy Bodies',
    tagline: 'Fuel your body with colorful nutrients, active play, and restful sleep!',
    icon: '❤️',
    themeColor: '#4C9F38',
    bgColor: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    shortExplanation: 'Your body is an incredible adventure vehicle! Eating colorful foods, drinking pure water, playing outdoors, and resting well gives your heart, bones, and brain superpower strength.',
    funFacts: [
      { icon: '🌈', text: 'Eating foods of different colors (red tomatoes, orange carrots, green broccoli) gives you different vitamins!' },
      { icon: '💓', text: 'Your heart beats about 100,000 times every day to pump energy to your toes and fingertips!' },
      { icon: '😄', text: 'Laughing with friends releases happy chemicals in your brain that boost your immune system!' }
    ],
    whatYouCanDo: [
      { emoji: '🥗', title: 'Eat a Rainbow', desc: 'Try to eat at least 3 differently colored fruits or vegetables each day.' },
      { emoji: '🏃', title: '30-Minute Play', desc: 'Run, skip rope, dance, or play tag outdoors in the fresh sunshine.' },
      { emoji: '🧼', title: 'Clean Hands Habit', desc: 'Wash hands with warm water and soap for 20 seconds before eating.' }
    ],
    video: {
      title: 'How Food Powers Your Body & Muscles',
      channel: 'SciShow Kids',
      duration: '4 mins',
      embedUrl: 'https://www.youtube-nocookie.com/embed/n4r48wO2GkI'
    },
    quiz: {
      id: 'quiz_sdg_3',
      title: 'Health Champion Quiz',
      xpReward: 20,
      bonusXp: 10,
      questions: [
        {
          id: 'q3_1',
          question: 'What does "eating a rainbow" mean?',
          options: [
            'Eating colorful fruits and vegetables like carrots, berries, and spinach ✅',
            'Eating only rainbow-colored candy 🍭',
            'Painting your dinner plate with food coloring 🎨',
            'Eating food while looking at a real rainbow 🌈'
          ],
          correctIndex: 0,
          explanation: 'Great job! Colorful natural foods provide all the vitamins your body needs to grow strong!'
        },
        {
          id: 'q3_2',
          question: 'How long should you wash your hands with soap to remove germs?',
          options: [
            'Just 1 second 💧',
            '20 seconds (like singing Happy Birthday twice!) ✅',
            '2 hours in the bathtub 🛁',
            'You do not need to wash hands 🚫'
          ],
          correctIndex: 1,
          explanation: 'Correct! 20 seconds of soapy scrubbing keeps unwanted germs far away!'
        },
        {
          id: 'q3_3',
          question: 'Why is getting 9 to 10 hours of sleep so good for kids?',
          options: [
            'It helps your brain organize what you learned and heals your muscles ✅',
            'It makes your pajamas look cooler 👕',
            'It lets your alarm clock take a nap ⏰',
            'It stops you from ever feeling hungry again 🍕'
          ],
          correctIndex: 0,
          explanation: 'Super! While you sleep peacefully, your body repairs itself and your brain builds memory muscles!'
        }
      ]
    },
    missionId: 'm_health_1'
  }
];
