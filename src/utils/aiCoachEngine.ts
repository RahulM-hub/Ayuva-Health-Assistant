export interface CoachUserProfile {
  gender?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: string;
  bmr?: number;
  tdee?: number;
  goal?: string;
  targetCalories?: number;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * High-precision, scientifically accurate fitness and nutrition AI intelligence engine
 * tailored specifically for Coach Ayuva.
 */
export function generateAccurateCoachResponse(
  query: string,
  profile?: CoachUserProfile,
  history?: ConversationTurn[]
): string {
  const q = (query || '').toLowerCase().trim();
  const weight = profile?.weightKg || 70;
  const bmr = profile?.bmr || 1650;
  const tdee = profile?.tdee || 2250;
  const targetCal = profile?.targetCalories || tdee;
  const goal = (profile?.goal || 'maintenance').toLowerCase();
  const proteinMin = Math.round(weight * 1.8);
  const proteinMax = Math.round(weight * 2.2);

  // 1. BICEPS / ARMS SPECIFIC QUERY
  if (
    q.includes('bicep') ||
    q.includes('biceps') ||
    q.includes('arm curl') ||
    q.includes('bigger arms') ||
    q.includes('peak bicep') ||
    q.includes('arm workout') ||
    q.includes('brachialis')
  ) {
    return `### 🎯 Targeted Biceps & Arm Hypertrophy Protocol

To maximize bicep hypertrophy and develop both peak height and arm thickness, your training must target all anatomical heads of the elbow flexors:

---

#### 1. Optimal Bicep Anatomy Breakdown
- **Long Head (Outer Peak):** Best isolated when the elbow starts behind the torso in a lengthened position (*Incline Dumbbell Curls at 45°*).
- **Short Head (Inner Thickness & Width):** Best isolated when the elbow is in front of the body (*Preacher Curls, Spider Curls, High Cable Curls*).
- **Brachialis & Brachioradialis (Arm Breadth):** Best targeted with a neutral or overhand grip (*Neutral Hammer Curls, Reverse EZ-Bar Curls*).

---

#### 2. Ayuva Bicep Workout Routine (10–12 Total Weekly Sets)
1. **Incline Dumbbell Curls:** 3 sets × 8–10 reps *(3s eccentric stretch at bottom, strict supination)*
2. **Standing EZ-Bar Curls:** 3 sets × 6–8 reps *(Heavy progressive overload, zero torso swing)*
3. **Preacher or Spider Curls:** 3 sets × 10–12 reps *(Strict peak contraction at the top for 1s)*
4. **Dumbbell Hammer Curls:** 3 sets × 10–12 reps *(Builds the brachialis to push the bicep higher)*

---

#### 3. Execution Rules for Fast Arm Growth
- **Frequency:** Hit biceps **2 times per week** (e.g. on Pull days or an dedicated Arm session).
- **Elbow Stability:** Pin elbows to your sides or bench; do not let anterior deltoids lift the weight.
- **Nutrition Context:** For your **${weight}kg** physique, ensure you hit **${proteinMin}g–${proteinMax}g of daily protein** to synthesize new muscle tissue.`;
  }

  // 2. TRICEPS SPECIFIC QUERY
  if (
    q.includes('tricep') ||
    q.includes('triceps') ||
    q.includes('horseshoe') ||
    q.includes('skull crusher') ||
    q.includes('pushdown')
  ) {
    return `### ⚡ Targeted Triceps Development Protocol

The triceps brachii accounts for **60–65% of total upper arm mass**. To build dense, horseshoe triceps, you must stimulate all three heads:

---

#### 1. The 3 Tricep Heads
- **Long Head (Largest mass on back of arm):** Requires overhead elbow extension to put the muscle under a deep stretch (*Overhead Cable Rope Extension, French Press*).
- **Lateral Head (Outer horseshoe flare):** Overloaded with downward pushing (*Cable Straight Bar / Rope Pushdowns*).
- **Medial Head (Lower elbow stability):** Overloaded with heavy compound pressing (*Close-Grip Barbell Bench Press, Weighted Parallel Dips*).

---

#### 2. Ayuva Tricep Workout Blueprint
1. **Close-Grip Bench Press or Weighted Dips:** 3–4 sets × 6–8 reps *(Heavy mechanical tension)*
2. **Overhead Cable Rope Extension:** 3 sets × 10–12 reps *(Full deep stretch behind head)*
3. **Tricep Cable Pushdowns:** 3 sets × 12–15 reps *(Spread rope apart at bottom for 1s lockout)*
4. **Lying EZ-Bar Skull Crushers:** 3 sets × 8–10 reps *(Lower to hairline with elbows tucked)*

---

#### 3. Coach Tip
Avoid flaring your elbows past 45 degrees to keep tension strictly on the triceps tendon and protect your shoulder joints.`;
  }

  // 3. CHEST SPECIFIC QUERY
  if (
    q.includes('chest') ||
    q.includes('pecs') ||
    q.includes('bench press') ||
    q.includes('upper chest') ||
    q.includes('lower chest') ||
    q.includes('inner chest')
  ) {
    return `### 🛡️ Complete Pectoral Hypertrophy & Strength Blueprint

To build a full, dense, armored chest, your routine must balance clavicular (upper), sternal (mid), and costal (lower) pectoral fibers:

---

#### 1. Muscle Division Focus
- **Upper Chest (Clavicular Head):** Incline pressing at a **30° bench angle** (angles above 45° shift tension into the anterior deltoids).
- **Mid & Overall Chest (Sternal Head):** Flat Barbell Bench Press or Flat Heavy Dumbbell Press.
- **Lower Chest & Sternal Tie-In:** Parallel Bar Dips with a 30° forward torso lean and High-to-Low Cable Flyes.

---

#### 2. Weekly Chest Routine (12–16 Weekly Sets)
1. **Flat Barbell Bench Press:** 4 sets × 6–8 reps *(Explosive concentric, 3s controlled descent)*
2. **30° Incline Dumbbell Press:** 3–4 sets × 8–10 reps *(Deep bottom stretch)*
3. **Chest Dips (Forward Lean):** 3 sets × 8–12 reps *(Drive through palms)*
4. **Standing Cable Flyes:** 3 sets × 12–15 reps *(Cross hands at peak contraction)*

---

#### 3. Key Form Cues
- **Scapular Retraction:** Pinch shoulder blades back and down into the bench before unracking.
- **Elbow Tuck:** Keep elbows at roughly a 45°–70° angle relative to your torso—never flare to 90°.`;
  }

  // 4. BACK & LATS QUERY
  if (
    q.includes('back') ||
    q.includes('lats') ||
    q.includes('lat pulldown') ||
    q.includes('pull up') ||
    q.includes('v-taper') ||
    q.includes('deadlift') ||
    q.includes('row') ||
    q.includes('rhomboid')
  ) {
    return `### 🦅 V-Taper Back Density & Width Architecture

Building a commanding V-taper back requires two distinct movement planes: **Vertical Pulling** (for lat width) and **Horizontal Rowing** (for mid-back thickness).

---

#### 1. Movement Plane Division
- **For Lat Width (V-Shape):** Wide-Grip Lat Pulldowns, Weighted Pull-Ups, Straight-Arm Cable Pullovers.
- **For Back Thickness (Rhomboids & Traps):** Barbell Bent-Over Rows, Chest-Supported T-Bar Rows, Seated Cable Rows.
- **For Posterior Chain Density:** Conventional or Romanian Deadlifts.

---

#### 2. Ayuva Back Hypertrophy Session
1. **Conventional Deadlift:** 3–4 sets × 4–6 reps *(Maximum motor unit recruitment)*
2. **Wide-Grip Pull-Ups or Lat Pulldowns:** 4 sets × 8–10 reps *(Drive elbows to back pockets)*
3. **Chest-Supported T-Bar Row:** 3–4 sets × 8–12 reps *(Squeeze shoulder blades for 1s)*
4. **Seated V-Grip Cable Row:** 3 sets × 10–12 reps *(Full stretch without rounding lumbar spine)*
5. **Cable Face Pulls:** 3 sets × 15–20 reps *(Rear deltoid and rotator cuff posture health)*

---

#### 3. Biomechanical Cue
Initiate every pulling rep by depressing the scapula (pulling your shoulders down) before bending the elbows.`;
  }

  // 5. SHOULDERS / DELTS QUERY
  if (
    q.includes('shoulder') ||
    q.includes('shoulders') ||
    q.includes('delt') ||
    q.includes('delts') ||
    q.includes('lateral raise') ||
    q.includes('overhead press') ||
    q.includes('side delt') ||
    q.includes('rear delt')
  ) {
    return `### ⚡ 3D Boulder Shoulder Blueprint

The shoulder consists of three distinct deltoid heads. To achieve capped, round 3D shoulders, you must isolate all three sections:

---

#### 1. Deltoid Focus
- **Lateral (Side) Delts:** Responsible for the wide visual shoulder cap (*Dumbbell & Cable Lateral Raises*).
- **Anterior (Front) Delts:** Heavily worked in all bench presses (*Overhead Barbell Military Press*).
- **Posterior (Rear) Delts:** Vital for 3D depth and preventing rounded posture (*Face Pulls, Reverse Cable Flyes*).

---

#### 2. Ayuva Shoulder Routine
1. **Standing Overhead Barbell Press:** 4 sets × 6–8 reps *(Brace glutes and core)*
2. **Dumbbell Lateral Raises:** 4–5 sets × 12–15 reps *(Lead with elbows, 2s eccentric descent)*
3. **Behind-the-Back Cable Lateral Raise:** 3 sets × 12–15 reps *(Continuous tension at the bottom)*
4. **Cable Face Pulls with External Rotation:** 4 sets × 15–20 reps *(Pull to eye level)*

---

#### 3. Side Delt Growth Secret
Side delts are predominantly slow-to-intermediate twitch fibers that recover quickly. You can train lateral raises **3 times per week** with 12–20 reps for rapid growth without central fatigue.`;
  }

  // 6. LEGS / QUADS / HAMSTRINGS / GLUTES / CALVES QUERY
  if (
    q.includes('leg') ||
    q.includes('legs') ||
    q.includes('squat') ||
    q.includes('quad') ||
    q.includes('quads') ||
    q.includes('hamstring') ||
    q.includes('glute') ||
    q.includes('calf') ||
    q.includes('calves') ||
    q.includes('hip thrust')
  ) {
    return `### 🦵 High-Output Lower Body & Leg Hypertrophy Blueprint

Lower body training triggers massive hormonal and metabolic adaptation. Here is how to target each lower body section:

---

#### 1. Muscle Breakdown
- **Quadriceps:** Barbell Back Squats, Hack Squats, Bulgarian Split Squats, Leg Extensions.
- **Hamstrings:** Romanian Deadlifts (eccentric hip hinge), Lying/Seated Leg Curls (knee flexion).
- **Glutes:** Barbell Hip Thrusts (peak contraction), Walking Lunges, Cable Kickbacks.
- **Calves:** Standing Calf Raises (Gastrocnemius), Seated Calf Raises (Soleus).

---

#### 2. Balanced Leg Day Routine
1. **Barbell Back Squats:** 4 sets × 6–8 reps *(Hip crease below knee parallel)*
2. **Romanian Deadlifts (RDLs):** 3–4 sets × 8–10 reps *(Push hips back, feel hamstring stretch)*
3. **Bulgarian Split Squats:** 3 sets per leg × 10–12 reps *(Unilateral stabilizer & quad burner)*
4. **Barbell Hip Thrusts:** 3–4 sets × 10–12 reps *(2s squeeze at the top)*
5. **Lying Leg Curls:** 3 sets × 12–15 reps *(Strict control)*
6. **Standing Calf Raises:** 4 sets × 15 reps *(2s pause at deep bottom stretch)*

---

#### 3. Pro Form Cue for Calves
Never bounce out of the bottom of a calf raise. The Achilles tendon absorbs elastic energy; pause for 2 full seconds at the bottom stretch to force the calf muscle fibers to do 100% of the work.`;
  }

  // 7. CORE / ABS QUERY
  if (
    q.includes('ab') ||
    q.includes('abs') ||
    q.includes('core') ||
    q.includes('six pack') ||
    q.includes('six-pack') ||
    q.includes('belly fat') ||
    q.includes('love handle') ||
    q.includes('oblique')
  ) {
    return `### ⚡ Direct Abdominal Development & Fat Loss Reality

---

#### 1. The Core Truth About Visible Six-Pack Abs
- **Diet (Caloric Deficit):** Abs are revealed in the kitchen. For men, abs become clearly visible around **10–12% body fat**; for women, around **18–20% body fat**. Spot reduction is physiologically impossible.
- **Hypertrophy (Thickening Abdominal Bricks):** Just like biceps or chest, the rectus abdominis must be loaded with progressive resistance to develop deep, visible ridges.

---

#### 2. Best Direct Ab Exercises
1. **Hanging Leg / Knee Raises:** 3–4 sets × 12–15 reps *(Roll pelvis upward, don't just swing legs)*
2. **Kneeling Cable Rope Crunches:** 3–4 sets × 12–15 reps *(Flex spine down toward knees)*
3. **Ab Wheel Rollouts:** 3 sets × 8–12 reps *(Extreme anti-extension core stability)*
4. **Standing Cable Oblique Woodchoppers:** 3 sets × 12–15 reps per side

---

#### 3. Metabolic Numbers for Your Goal
Your target intake is **${targetCal} kcal/day** (BMR: ${bmr}, TDEE: ${tdee}). Maintaining this target with **${proteinMin}g+ protein** will shed subcutaneous belly fat while maintaining your lean abdominal muscle.`;
  }

  // 8. FAT LOSS PLATEAU QUERY
  if (
    q.includes('plateau') ||
    q.includes('stuck') ||
    q.includes('stop losing') ||
    q.includes("can't lose weight") ||
    q.includes('stalled') ||
    q.includes('fat loss stopped')
  ) {
    return `### 🛑 Breaking Through a Fat Loss Plateau: 5-Step Protocol

If the scale has not budged for **14 consecutive days**, here is the physiological breakdown and how to restart fat burning immediately:

---

#### 1. Common Causes of Stalls
1. **Metabolic Adaptation & Lower NEAT:** As you lose weight, your body burns fewer calories naturally, and unconscious daily movement (fidgeting, pacing) decreases.
2. **Water Retention & Cortisol:** Elevated training fatigue or calorie restriction raises cortisol, masking 1–2 kg of real fat loss under water.
3. **Calorie Creep:** Unmeasured oils, salad dressings, and liquid calories easily erase a 300–500 kcal deficit.

---

#### 2. Ayuva Action Steps to Break the Plateau
1. **Audit Food Tracking with a Kitchen Scale:** Weigh all raw foods, cooking oils, and condiments accurately for 7 days.
2. **Set a Daily Step Floor (NEAT):** Aim for **8,000–10,000 steps daily**. This burns 300–400 kcal without spiking hunger.
3. **Slight Calorie Adjustment:** Reduce daily intake by **150 kcal** (adjusting from ${targetCal} kcal to **${Math.max(1300, targetCal - 150)} kcal/day**).
4. **Implement a 48-Hour Diet Refeed:** Eat at your maintenance TDEE (**${tdee} kcal/day**) for 2 consecutive days, keeping protein at **${proteinMin}g** and increasing carbs. This lowers cortisol, refills muscle glycogen, and normalizes leptin.
5. **Prioritize 8 Hours of Sleep:** Sleep deprivation reduces insulin sensitivity and elevates ghrelin (hunger hormone).`;
  }

  // 9. BULK VS CUT / BODY RECOMPOSITION
  if (
    q.includes('bulk or cut') ||
    q.includes('cut or bulk') ||
    q.includes('recomp') ||
    q.includes('skinny fat') ||
    q.includes('bulking') ||
    q.includes('cutting') ||
    q.includes('surplus') ||
    q.includes('deficit')
  ) {
    return `### ⚖️ Should You Bulk, Cut, or Recomp? Decision Guide

Based on sports nutrition science, here is how to decide your exact strategy:

---

#### 1. The Decision Matrix
- **CUT (Caloric Deficit):** If body fat is **>15% (men)** or **>24% (women)**, or if your primary goal is defined abs and vascularity. Run a moderate deficit of 300–500 kcal below TDEE.
- **LEAN BULK (Controlled Surplus):** If body fat is **<12% (men)** or **<20% (women)**, and you want to build maximum muscle. Eat in a lean surplus of **+200 to +300 kcal/day** above TDEE (never dirty bulk!).
- **BODY RECOMPOSITION (Maintenance):** If you are a beginner, returning after a layoff, or "skinny fat" (normal weight but low muscle/high fat). Eat at exact maintenance TDEE with high protein (**2.0g/kg**).

---

#### 2. Your Profile Custom Metrics
- **Your Maintenance (TDEE):** ${tdee} kcal/day
- **Your Current Target:** ${targetCal} kcal/day (${profile?.goal || 'Current Goal'})
- **Daily Protein Requirement:** ${proteinMin}g – ${proteinMax}g daily

---

#### 3. Recommended Approach
Stick to your current target of **${targetCal} kcal/day** with consistent heavy compound lifting for **6–8 weeks**. Aim to progress weight on your lifts every week.`;
  }

  // 10. PRE & POST-WORKOUT NUTRITION
  if (
    q.includes('pre-workout') ||
    q.includes('post-workout') ||
    q.includes('pre workout') ||
    q.includes('post workout') ||
    q.includes('meal timing') ||
    q.includes('before gym') ||
    q.includes('after gym') ||
    q.includes('eating before') ||
    q.includes('eating after')
  ) {
    return `### ⚡ Pre-Workout & Post-Workout Nutrient Timing Blueprint

Optimizing nutrient timing ensures maximal gym performance, high glycogen stores, and rapid muscle protein synthesis (MPS):

---

#### 1. Pre-Workout Meal (1.5 – 2 Hours Before Lifting)
- **Goal:** Fuel muscles with glycogen, sustain steady blood sugar, and provide circulating amino acids.
- **Ideal Structure:** Fast-to-moderate digesting carbs + moderate lean protein + low fat & fiber (fat slows digestion).
- **Example Options:**
  - 60g Oatmeal with 1 scoop Whey Protein and 1 sliced Banana (~400 kcal, 30g protein, 60g carbs).
  - 2 slices Whole Wheat Toast with 3 scrambled Egg Whites + 1 whole egg and 1 tbsp honey.
  - 200g Greek Yogurt with blueberries and a rice cake.

---

#### 2. Post-Workout Meal (Within 45 – 90 Minutes After Lifting)
- **Goal:** Trigger Muscle Protein Synthesis (MPS), reverse muscle protein breakdown, and replenish glycogen.
- **Ideal Structure:** 25–40g high-quality protein + moderate-to-high complex carbs.
- **Example Options:**
  - 150g Grilled Chicken Breast + 200g White/Jasmine Rice + steamed asparagus (~500 kcal, 42g protein, 65g carbs).
  - Post-Gym Shake: 1.5 scoops Whey Isolate + 1 Banana + 250ml skim milk / almond milk.
  - 180g Salmon or Tofu + Sweet Potato Mash + spinach.

---

#### 3. Hydration & Electrolytes
Drink **500ml of water with a pinch of sea salt** 30 minutes before training to maximize cell volumization, pump, and muscular power.`;
  }

  // 11. PROTEIN INTAKE & MPS
  if (
    q.includes('protein') ||
    q.includes('how much protein') ||
    q.includes('grams of protein') ||
    q.includes('leucine') ||
    q.includes('protein synthesis') ||
    q.includes('protein per meal')
  ) {
    return `### 🥩 Protein Optimization & Muscle Protein Synthesis (MPS)

---

#### 1. Your Custom Daily Protein Target
For your weight of **${weight} kg**, the scientifically validated sweet spot for muscle building and fat loss is **1.8g – 2.2g per kg of body weight**:
- **Daily Target Range:** **${proteinMin}g – ${proteinMax}g of protein per day**
- **Caloric Equivalent:** ${proteinMin * 4} – ${proteinMax * 4} kcal from pure protein.

---

#### 2. Per-Meal Leucine Threshold
- To maximally trigger Muscle Protein Synthesis (MPS), a meal must contain at least **2.5g – 3.0g of the amino acid Leucine**.
- This equals roughly **25g – 40g of complete protein per meal**.
- Eating 120g of protein in one meal does not stimulate 4x the MPS. Spreading your protein across **3 to 4 meals** (e.g. 4 meals of ~${Math.round(proteinMin / 4)}g each) delivers superior all-day muscle growth.

---

#### 3. Best Bioavailable Protein Sources
1. **Animal Sources:** Chicken breast, turkey, eggs/egg whites, whey isolate, lean beef, salmon, cottage cheese, Greek yogurt.
2. **Plant Sources:** Tofu, tempeh, seitan, edamame, pea & rice protein isolate blends.`;
  }

  // 12. CREATINE & SUPPLEMENTS
  if (
    q.includes('creatine') ||
    q.includes('supplement') ||
    q.includes('supplements') ||
    q.includes('whey') ||
    q.includes('bcaa') ||
    q.includes('caffeine') ||
    q.includes('ashwagandha') ||
    q.includes('vitamin d')
  ) {
    return `### 💊 Evidence-Based Supplementation Guide

Here is the clinical consensus on the most effective fitness supplements:

---

#### 1. Creatine Monohydrate (Tier 1 - Essential)
- **Dose:** **3g – 5g daily**, taken consistently every single day (lifting days and rest days).
- **Mechanism:** Saturates phosphocreatine stores in skeletal muscle, increasing ATP energy for heavy compound lifts and boosting power output by 5–15%.
- **Loading Phase:** Optional (20g/day for 5 days), but 5g daily achieves full saturation within 3 weeks without stomach upset.
- **Timing:** Any time of day (post-workout with carbs/protein yields slightly better absorption).

---

#### 2. Whey Protein Isolate / Concentrate
- Fast, convenient way to hit your daily **${proteinMin}g+ protein target**. Take 1 scoop (25g protein) post-workout or between meals.

---

#### 3. Caffeine (Pre-Workout Performance)
- **Dose:** 3–5mg per kg of bodyweight (~200–300mg) taken 30–45 minutes before training. Increases motor unit recruitment and reduces perceived exertion.

---

#### 4. Daily Health Foundations
- **Vitamin D3 (2000–5000 IU/day):** Crucial for testosterone synthesis and immune function.
- **Omega-3 Fish Oil (2–3g total EPA/DHA):** Reduces joint inflammation and improves insulin sensitivity.
- **Electrolytes:** Sodium, Potassium, Magnesium for peak muscular contraction.`;
  }

  // 13. WORKOUT SPLIT (PPL VS UPPER/LOWER VS FULL BODY)
  if (
    q.includes('split') ||
    q.includes('ppl') ||
    q.includes('push pull legs') ||
    q.includes('upper lower') ||
    q.includes('full body') ||
    q.includes('how many days') ||
    q.includes('routine')
  ) {
    return `### 📋 Finding Your Ideal Workout Split

The best workout split is the one you can adhere to with 100% consistency while stimulating each muscle group **2 times per week**:

---

#### 1. Push / Pull / Legs (PPL) — 3 to 6 Days/Week
- **Best For:** Intermediate to advanced lifters seeking dedicated volume per muscle group.
  - **Push:** Chest, Shoulders, Triceps
  - **Pull:** Back, Biceps, Rear Delts
  - **Legs:** Quads, Hamstrings, Glutes, Calves
- **Structure:** Push/Pull/Legs/Rest/Repeat or 3-day on/1-day off.

---

#### 2. Upper / Lower Split — 4 Days/Week
- **Best For:** Busy individuals and strength progression (Mon/Tue Upper/Lower, Thu/Fri Upper/Lower).
- Provides ample recovery days for central nervous system and joint health.

---

#### 3. 3-Day Full Body Blueprint — 3 Days/Week
- **Best For:** Beginners, fat loss protocols, or lifters with limited schedules (e.g. Mon / Wed / Fri).
- High metabolic caloric burn because entire musculature is recruited every session.

---

#### 4. Coach Ayuva Recommendation
Select the split that fits your lifestyle. Check the **Gym Workouts** tab in this app to see your ready-to-use routine with complete exercise form cues!`;
  }

  // 14. CARDIO & FAT LOSS
  if (
    q.includes('cardio') ||
    q.includes('hiit') ||
    q.includes('liss') ||
    q.includes('running') ||
    q.includes('treadmill') ||
    q.includes('steps') ||
    q.includes('10000 steps') ||
    q.includes('cycling')
  ) {
    return `### 🏃 Cardio Strategy for Maximum Fat Loss Without Muscle Loss

---

#### 1. The Best Cardio Types
- **Low-Intensity Steady State (LISS) & Incline Walking (Gold Standard):**
  - Incline treadmill walk: **10–12% incline, 4.5–5.0 km/h speed for 25–35 minutes**.
  - Burns ~250–350 kcal derived primarily from fatty acid oxidation with zero impact on knee joints or recovery.
- **Daily Step Goal (NEAT):**
  - Aim for **8,000 to 10,000 steps daily**. This burns 300–500 kcal passively without increasing appetite.
- **High-Intensity Interval Training (HIIT):**
  - 15–20 minutes of 30s sprint / 60s recovery (Concept2 Rower or Assault Bike) 1–2x per week for VO2 max.

---

#### 2. How to Avoid the "Interference Effect"
- Never perform intense cardio *immediately before* heavy compound weightlifting (squats, bench, deadlifts). Always lift weights first when glycogen and nervous system output are freshest, then finish with cardio or do cardio on off-days.`;
  }

  // 15. VEGETARIAN / VEGAN
  if (
    q.includes('vegan') ||
    q.includes('vegetarian') ||
    q.includes('plant based') ||
    q.includes('plant-based') ||
    q.includes('tofu') ||
    q.includes('paneer') ||
    q.includes('soya') ||
    q.includes('veg diet') ||
    q.includes('veg protein')
  ) {
    return `### 🌱 Indian Vegetarian Muscle Building & Nutrition Guide

You can build exceptional lean muscle on an authentic Indian vegetarian diet by utilizing high-yield Indian staples:

---

#### 1. High-Density Indian Vegetarian Protein Sources
- **Soya Chunks (Nutrela):** 52g protein per 100g dry weight (the highest plant protein yield in Indian cuisine).
- **Low-Fat Paneer / Cottage Cheese:** 18–20g protein per 100g.
- **Lentils & Legumes:** Moong Dal, Toor Dal, Chana Dal, Rajma, and Kala Chana (20–24g protein per 100g dry).
- **Chana Sattu (Roasted Gram Flour):** 20g protein per 100g with natural minerals and electrolytes.
- **Low-Fat Curd (Dahi) & Greek Yogurt:** 8–15g protein per serving with beneficial gut probiotics.
- **Whey or Plant Protein Isolate:** 25g pure bioavailable protein per scoop to hit your daily target effortlessly.

---

#### 2. Key Micronutrients for Plant-Based Athletes
- **Vitamin B12:** Essential for red blood cell formation and nerve health.
- **Creatine Monohydrate:** Plant-based athletes have lower baseline muscle creatine stores; taking **5g daily** produces dramatic strength and hypertrophy gains.
- **Iron & Zinc:** Consume lentils with vitamin C (lemon juice, tomatoes) to boost non-heme iron absorption.`;
  }

  // 16. SLEEP, RECOVERY & DELOAD
  if (
    q.includes('sleep') ||
    q.includes('recovery') ||
    q.includes('rest day') ||
    q.includes('sore') ||
    q.includes('doms') ||
    q.includes('deload') ||
    q.includes('overtraining')
  ) {
    return `### 💤 Muscle Growth Occurs During Recovery

Lifting weights in the gym breaks down muscle fibers; the actual muscle repair and growth occurs strictly during rest and deep sleep:

---

#### 1. The Sleep Anabolic Window
- Aim for **7.5 to 9 hours of quality sleep nightly**.
- During slow-wave deep sleep, your body releases **70% of its daily Growth Hormone (GH)** and regulates testosterone production.
- Sleeping <6 hours drops testosterone by 10–15% and increases muscle protein breakdown by 18%.

---

#### 2. Active Recovery on Rest Days
- Take a 30–45 minute walk (5,000 steps).
- Foam roll tight IT bands, quads, and thoracic spine.
- Maintain your protein intake (**${proteinMin}g/day**) on rest days to fuel continuous tissue repair.

---

#### 3. When to Take a Deload Week
Every **6 to 8 weeks** of intense progressive overload, reduce training weights by 40–50% for 5–7 days to allow connective tissues and the nervous system to fully recover.`;
  }

  // 17. MEAL PLAN / WHAT TO EAT
  if (
    q.includes('meal plan') ||
    q.includes('diet plan') ||
    q.includes('what should i eat') ||
    q.includes('what to eat') ||
    q.includes('breakfast') ||
    q.includes('lunch') ||
    q.includes('dinner') ||
    q.includes('sample meal') ||
    q.includes('food') ||
    q.includes('recipe') ||
    q.includes('indian food')
  ) {
    const mealCal = Math.round(targetCal / 4);
    const mealProtein = Math.round(proteinMin / 4);
    return `### 🥗 Customized Indian Daily Meal Blueprint (~${targetCal} kcal/day)

Here are actionable Indian meal plans crafted for your **${targetCal} kcal** target and **${proteinMin}g protein** requirement:

---

#### 🥦 Option A: Indian Pure Vegetarian Plan (~${targetCal} kcal | ${proteinMin}g Protein)
1. **Breakfast:** 150g Low-Fat Paneer Bhurji with 1 Whole Wheat Phulka + Mint Chutney + 1 cup Masala Chai (no sugar) (~${mealCal} kcal | ${mealProtein}g P).
2. **Lunch:** 1.5 Katori Thick Dal Tadka / Rajma + 50g Soya Chunks sautéed with spinach + 1 small bowl Basmati Rice + 1 bowl Low-Fat Curd (Dahi) + Kachumber Salad (~${mealCal} kcal | ${mealProtein}g P).
3. **Evening Snack:** Sprouted Moong & Kala Chana Chaat (100g) or 1 scoop Whey/Sattu Drink + 20g Roasted Makhana (~${mealCal - 60} kcal | 25g P).
4. **Dinner:** 140g Grilled Paneer Tikka / Soya Chaap + 1 Multigrain Phulka + Sautéed Mixed Vegetables (Bhindi/Lauki) + Warm Haldi Doodh (~${mealCal + 60} kcal | ${mealProtein}g P).

---

#### 🍗 Option B: Indian Non-Vegetarian Plan (~${targetCal} kcal | ${proteinMin}g Protein)
1. **Breakfast:** 4 Egg White + 1 Whole Egg Masala Anda Bhurji with 1 Phulka or Multigrain Toast + Black Coffee / Masala Chai (~${mealCal} kcal | ${mealProtein}g P).
2. **Lunch:** 180g Tandoori Chicken Breast or Homestyle Chicken Curry (minimal oil) + 1 cup Steamed Rice + 1 bowl Cucumber Raita + Green Salad (~${mealCal} kcal | ${mealProtein}g P).
3. **Evening Snack:** 3 Boiled Egg Whites with Chaat Masala + 30g Roasted Chana + Green Tea (~${mealCal - 60} kcal | 25g P).
4. **Dinner:** 180g Coastal Fish Curry (Rohu/Surmai) or Grilled Chicken Tikka + 1 Phulka + Sautéed Palak Subzi (~${mealCal + 60} kcal | ${mealProtein}g P).

---

👉 *You can also toggle between Vegetarian and Non-Vegetarian plans directly in the **Diet Blueprint** tab on this app!*`;
  }

  // 18. WATER / HYDRATION
  if (
    q.includes('water') ||
    q.includes('hydration') ||
    q.includes('how much water') ||
    q.includes('liters') ||
    q.includes('drink')
  ) {
    const waterLiters = ((weight * 0.035) + 0.5).toFixed(1);
    return `### 💧 Optimal Hydration & Performance Protocol

Proper intracellular hydration is crucial for cellular osmosis, joint lubrication, and maintaining peak muscle contractions:

---

#### 1. Daily Fluid Intake Target
- **Baseline Water Requirement:** **${waterLiters} Liters per day** (based on your body weight of ${weight}kg plus active perspiration).
- **Gym Training Add-On:** Drink 500–700 ml of fluid for every hour of high-intensity lifting.

---

#### 2. Electrolyte Balance
- Add a pinch of Himalayan pink salt or sodium-potassium-magnesium electrolyte powder to your pre-workout fluid.
- Adequate sodium increases intracellular volume, enhancing the muscle pump and preventing cramps.`;
  }

  // 19. SQUAT / BENCH / DEADLIFT FORM & TECHNIQUE
  if (
    q.includes('form') ||
    q.includes('technique') ||
    q.includes('injury') ||
    q.includes('joint pain') ||
    q.includes('knee pain') ||
    q.includes('back pain') ||
    q.includes('shoulder pain') ||
    q.includes('warm up') ||
    q.includes('mobility')
  ) {
    return `### 🛡️ Biomechanical Joint Safety & Exercise Technique Protocol

Lifting with strict biomechanics maximizes muscle recruitment while protecting tendons and spinal ligaments:

---

#### 1. Compound Form Essentials
- **Squats:** Break at hips and knees simultaneously; maintain neutral lumbar spine; keep knees tracking over toes without collapsing inward (valgus).
- **Deadlifts:** Pack lats back and down (scapular depression); pull the slack out of the bar; drive through the floor with your mid-foot.
- **Bench Press:** Retract and depress scapula; maintain a natural thoracic arch; tuck elbows to a 45°–70° angle.

---

#### 2. Warm-Up & Joint Preparation
1. 5 minutes of low-intensity cardio (treadmill walk or rower) to raise core body temperature.
2. Dynamic mobility: Band pull-aparts, hip 90/90s, thoracic spine rotations.
3. 2–3 ramp-up warmup sets with light weights before working loads.`;
  }

  // 20. INTERMITTENT FASTING / KETO / DIET TYPES
  if (
    q.includes('fasting') ||
    q.includes('intermittent fasting') ||
    q.includes('16/8') ||
    q.includes('keto') ||
    q.includes('carnivore') ||
    q.includes('low carb')
  ) {
    return `### ⏱️ Dietary Framework Analysis: Fasting, Keto & Low-Carb

All weight loss diets work primarily through energy balance (Calorie In vs. Calorie Out). Here is the scientific reality of popular dietary models:

---

#### 1. Intermittent Fasting (e.g., 16/8 Window)
- **Mechanism:** Compressing eating into an 8-hour window helps many naturally restrict calories.
- **Muscle Consideration:** Distribute your **${proteinMin}g daily protein** across at least 2–3 large meals within the eating window to maintain muscle protein synthesis.

#### 2. Ketogenic / Low-Carb
- **Mechanism:** Induces ketosis via extreme carb restriction (<50g/day).
- **Performance Trade-off:** Muscle glycogen stores will be depleted, which may reduce explosive anaerobic lifting capacity.

---

#### 3. Best Approach for Your Target (${targetCal} kcal/day)
Adhere to a flexible balanced diet with **${proteinMin}g+ protein**, complex carbohydrates for workout performance, and healthy fats.`;
  }

  // 21. METABOLISM / HORMONES / TESTOSTERONE
  if (
    q.includes('testosterone') ||
    q.includes('hormone') ||
    q.includes('metabolism') ||
    q.includes('thyroid') ||
    q.includes('cortisol')
  ) {
    return `### 🔬 Endocrine & Metabolic Optimization Blueprint

Optimizing your hormonal profile accelerates muscle growth, fat oxidation, and daily vitality:

---

#### 1. Natural Testosterone & Growth Hormone Drivers
- **Heavy Compound Lifts:** Multi-joint lifts (Squats, Deadlifts, Presses) trigger acute endocrine responses.
- **Dietary Fat Floor:** Ensure at least 20–25% of your **${targetCal} kcal** comes from healthy fats (egg yolks, avocados, olive oil) for steroid hormone synthesis.
- **Zinc & Magnesium (ZMA) & Vitamin D3:** Essential co-factors for testosterone production.
- **Deep Sleep:** 70% of daily Growth Hormone (GH) is secreted during stage 3 and 4 deep sleep.

---

#### 2. Cortisol Management
Excessive chronic stress or extreme starvation diets elevate cortisol, which promotes water retention and muscle catabolism. Stay within your recommended **${targetCal} kcal/day** target.`;
  }

  // 22. GENERAL / OPEN-ENDED QUERY DIRECT ANSWER
  return `### 📊 Coach Ayuva Sports Science & Nutrition Analysis

Regarding your inquiry: **"${query}"**

---

#### 1. Physiological Context & Principles
- **Metabolic Alignment:** With your **${weight}kg** physique, your resting BMR is **${bmr} kcal/day** and total maintenance TDEE is **${tdee} kcal/day**.
- **Prescribed Target:** For your goal (${profile?.goal || 'Maintenance / Progress'}), your daily intake is set to **${targetCal} kcal/day**.
- **Protein Synthesis:** Maintain **${proteinMin}g – ${proteinMax}g of protein daily** (1.8–2.2g per kg) distributed across 3–4 balanced meals.

---

#### 2. Actionable Implementation
1. **Focus on Progressive Overload:** Add weight, improve tempo, or increase reps weekly across all key gym lifts.
2. **Nutrient Quality:** Combine lean protein sources, complex carbohydrates (oats, sweet potatoes, rice), and fibrous green vegetables.
3. **Daily Movement & Hydration:** Hit 8,000–10,000 steps daily and drink 3.5+ liters of water.

---

💬 *You can ask Coach Ayuva any specific question regarding workout technique, arm/chest routines, fat loss science, meal recipes, or supplementation!*`;
}
