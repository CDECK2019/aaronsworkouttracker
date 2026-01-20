/**
 * Curated Exercise Database
 * Based on data from https://github.com/yuhonas/free-exercise-db
 * Images hosted on GitHub raw URLs
 */

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export const exercises = [
    // ==================== CHEST ====================
    {
        id: 'barbell_bench_press',
        name: 'Barbell Bench Press',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'triceps'],
        instructions: [
            'Lie back on a flat bench. Grip the bar with hands slightly wider than shoulder-width.',
            'Lift the bar off the rack and hold it straight over you with your arms locked.',
            'Lower the bar slowly until it touches your mid-chest.',
            'Push the bar back to starting position as you breathe out.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'push_up',
        name: 'Push-Up',
        force: 'push',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'triceps'],
        instructions: [
            'Get into a plank position with hands slightly wider than shoulder-width.',
            'Keep your body in a straight line from head to heels.',
            'Lower your body until your chest nearly touches the floor.',
            'Push yourself back up to the starting position.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'dumbbell_flye',
        name: 'Dumbbell Flye',
        force: 'push',
        level: 'intermediate',
        mechanic: 'isolation',
        equipment: 'dumbbell',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        instructions: [
            'Lie on a flat bench with a dumbbell in each hand, palms facing each other.',
            'Extend your arms above you with a slight bend in your elbows.',
            'Lower your arms out to the sides in a wide arc until you feel a stretch.',
            'Bring the dumbbells back up using the same arc motion.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== BACK ====================
    {
        id: 'pull_up',
        name: 'Pull-Up',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['lats'],
        secondaryMuscles: ['biceps', 'middle back'],
        instructions: [
            'Grab the pull-up bar with palms facing forward, hands wider than shoulder-width.',
            'Hang with arms fully extended and legs off the floor.',
            'Pull yourself up until your chin is above the bar.',
            'Lower yourself back down with control.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'bent_over_row',
        name: 'Bent Over Barbell Row',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['middle back'],
        secondaryMuscles: ['biceps', 'lats', 'shoulders'],
        instructions: [
            'Hold a barbell with palms facing down, bend your knees slightly.',
            'Bend forward at the waist, keeping your back straight.',
            'Pull the barbell toward your torso, keeping elbows close to your body.',
            'Lower the barbell back down with control.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'deadlift',
        name: 'Deadlift',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['lower back'],
        secondaryMuscles: ['glutes', 'hamstrings', 'quadriceps'],
        instructions: [
            'Stand with feet hip-width apart, barbell over the middle of your feet.',
            'Bend at hips and knees, grip the bar just outside your legs.',
            'Keep your back flat, chest up, and drive through your heels to stand.',
            'Lower the bar by pushing your hips back first.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== SHOULDERS ====================
    {
        id: 'overhead_press',
        name: 'Overhead Press',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['triceps'],
        instructions: [
            'Stand with feet shoulder-width apart, barbell at shoulder height.',
            'Grip the bar slightly wider than shoulder-width.',
            'Press the bar overhead until arms are fully extended.',
            'Lower back to shoulder height with control.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'lateral_raise',
        name: 'Dumbbell Lateral Raise',
        force: 'push',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'dumbbell',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        instructions: [
            'Stand with dumbbells at your sides, palms facing in.',
            'Keep a slight bend in your elbows throughout.',
            'Raise arms out to the sides until parallel with the floor.',
            'Lower back down slowly.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== ARMS ====================
    {
        id: 'barbell_curl',
        name: 'Barbell Curl',
        force: 'pull',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'barbell',
        primaryMuscles: ['biceps'],
        secondaryMuscles: ['forearms'],
        instructions: [
            'Stand with feet shoulder-width apart, holding a barbell with underhand grip.',
            'Keep your elbows close to your torso.',
            'Curl the bar up toward your shoulders, squeezing your biceps.',
            'Lower the bar back down slowly.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'tricep_dip',
        name: 'Tricep Dip',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['triceps'],
        secondaryMuscles: ['chest', 'shoulders'],
        instructions: [
            'Grip parallel bars and lift yourself up with arms straight.',
            'Lower your body by bending your elbows to about 90 degrees.',
            'Keep your torso upright to focus on triceps.',
            'Push back up to starting position.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'hammer_curl',
        name: 'Hammer Curl',
        force: 'pull',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'dumbbell',
        primaryMuscles: ['biceps'],
        secondaryMuscles: ['forearms'],
        instructions: [
            'Stand holding dumbbells at your sides, palms facing each other.',
            'Keep your elbows close to your body.',
            'Curl the weights up while keeping palms facing each other.',
            'Lower back down with control.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== LEGS ====================
    {
        id: 'squat',
        name: 'Barbell Squat',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes', 'hamstrings', 'calves', 'lower back'],
        instructions: [
            'Position the barbell on your upper back, feet shoulder-width apart.',
            'Keep your chest up and core tight.',
            'Lower down by bending at the hips and knees until thighs are parallel.',
            'Drive through your heels to stand back up.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'lunge',
        name: 'Dumbbell Lunge',
        force: 'push',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'dumbbell',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
        instructions: [
            'Stand holding dumbbells at your sides.',
            'Step forward with one leg into a lunge position.',
            'Lower your hips until both knees are bent at 90 degrees.',
            'Push back to starting position and repeat with the other leg.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'leg_press',
        name: 'Leg Press',
        force: 'push',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'machine',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
        instructions: [
            'Sit in the leg press machine with feet on the platform.',
            'Release the safety handles and lower the weight.',
            'Lower until your knees are at 90 degrees.',
            'Push through your heels to extend your legs.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'romanian_deadlift',
        name: 'Romanian Deadlift',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['hamstrings'],
        secondaryMuscles: ['glutes', 'lower back'],
        instructions: [
            'Stand holding a barbell at hip level with overhand grip.',
            'Push your hips back and lower the bar along your legs.',
            'Keep your back flat and knees slightly bent.',
            'Lower until you feel a stretch in hamstrings, then return to start.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'calf_raise',
        name: 'Standing Calf Raise',
        force: 'push',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'machine',
        primaryMuscles: ['calves'],
        secondaryMuscles: [],
        instructions: [
            'Stand on a calf raise machine with shoulders under the pads.',
            'Lower your heels as far as possible to stretch your calves.',
            'Raise up on your toes as high as possible.',
            'Hold briefly at the top, then lower with control.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== CORE ====================
    {
        id: 'plank',
        name: 'Plank',
        force: 'static',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['abdominals'],
        secondaryMuscles: ['lower back', 'shoulders'],
        instructions: [
            'Get into a push-up position but rest on your forearms.',
            'Keep your body in a straight line from head to heels.',
            'Engage your core and hold the position.',
            'Keep breathing steadily throughout.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'crunch',
        name: 'Crunch',
        force: 'pull',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['abdominals'],
        secondaryMuscles: [],
        instructions: [
            'Lie on your back with knees bent and feet flat on the floor.',
            'Place hands behind your head or across your chest.',
            'Lift your shoulders off the floor by contracting your abs.',
            'Lower back down with control.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'russian_twist',
        name: 'Russian Twist',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['abdominals'],
        secondaryMuscles: ['obliques'],
        instructions: [
            'Sit on the floor with knees bent and lean back slightly.',
            'Hold a weight or clasp hands in front of you.',
            'Rotate your torso to the right, then to the left.',
            'Keep your core engaged throughout the movement.',
        ],
        category: 'strength',
        images: [],
    },
    {
        id: 'leg_raise',
        name: 'Hanging Leg Raise',
        force: 'pull',
        level: 'intermediate',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['abdominals'],
        secondaryMuscles: ['hip flexors'],
        instructions: [
            'Hang from a pull-up bar with arms fully extended.',
            'Keep your legs straight and together.',
            'Raise your legs until they are parallel to the floor.',
            'Lower back down with control.',
        ],
        category: 'strength',
        images: [],
    },

    // ==================== CARDIO ====================
    {
        id: 'jumping_jack',
        name: 'Jumping Jacks',
        force: 'push',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['shoulders', 'calves', 'abdominals'],
        instructions: [
            'Stand with feet together and arms at your sides.',
            'Jump while spreading legs and raising arms overhead.',
            'Jump back to starting position.',
            'Repeat at a steady pace.',
        ],
        category: 'cardio',
        images: [],
    },
    {
        id: 'burpee',
        name: 'Burpee',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['chest', 'shoulders', 'abdominals'],
        instructions: [
            'Start standing, then squat down and place hands on floor.',
            'Jump feet back into plank position.',
            'Do a push-up, then jump feet back toward hands.',
            'Jump up with arms overhead.',
        ],
        category: 'cardio',
        images: [],
    },
    {
        id: 'mountain_climber',
        name: 'Mountain Climbers',
        force: 'push',
        level: 'intermediate',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['abdominals', 'shoulders', 'hip flexors'],
        instructions: [
            'Start in a push-up position.',
            'Drive one knee toward your chest.',
            'Quickly switch legs, driving the other knee forward.',
            'Continue alternating at a fast pace.',
        ],
        category: 'cardio',
        images: [],
    },
    {
        id: 'high_knees',
        name: 'High Knees',
        force: 'push',
        level: 'beginner',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['hip flexors', 'calves', 'abdominals'],
        instructions: [
            'Stand with feet hip-width apart.',
            'Run in place, bringing knees up to hip height.',
            'Pump your arms as you run.',
            'Maintain a quick pace.',
        ],
        category: 'cardio',
        images: [],
    },

    // ==================== STRETCHING ====================
    {
        id: 'quad_stretch',
        name: 'Standing Quad Stretch',
        force: 'static',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: [],
        instructions: [
            'Stand on one leg, holding onto a wall or chair for balance.',
            'Bend your other knee and grab your ankle behind you.',
            'Pull your heel toward your glute.',
            'Hold for 20-30 seconds, then switch legs.',
        ],
        category: 'stretching',
        images: [],
    },
    {
        id: 'hamstring_stretch',
        name: 'Standing Hamstring Stretch',
        force: 'static',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['hamstrings'],
        secondaryMuscles: [],
        instructions: [
            'Stand and extend one leg forward with heel on ground.',
            'Keep your back straight and hinge forward at the hips.',
            'Reach toward your toes until you feel a stretch.',
            'Hold for 20-30 seconds, then switch legs.',
        ],
        category: 'stretching',
        images: [],
    },
    {
        id: 'chest_stretch',
        name: 'Doorway Chest Stretch',
        force: 'static',
        level: 'beginner',
        mechanic: 'isolation',
        equipment: 'body only',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        instructions: [
            'Stand in a doorway with forearms on either side of the frame.',
            'Step forward until you feel a stretch across your chest.',
            'Keep your back straight and core engaged.',
            'Hold for 20-30 seconds.',
        ],
        category: 'stretching',
        images: [],
    },
];

// Helper functions to filter exercises
export const getExercisesByMuscle = (muscle) =>
    exercises.filter(ex =>
        ex.primaryMuscles.includes(muscle.toLowerCase()) ||
        ex.secondaryMuscles.includes(muscle.toLowerCase())
    );

export const getExercisesByEquipment = (equipment) =>
    exercises.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase());

export const getExercisesByLevel = (level) =>
    exercises.filter(ex => ex.level === level.toLowerCase());

export const getExercisesByCategory = (category) =>
    exercises.filter(ex => ex.category === category.toLowerCase());

export const getExerciseById = (id) =>
    exercises.find(ex => ex.id === id);

// Get unique values for filters
export const getMuscleGroups = () => {
    const muscles = new Set();
    exercises.forEach(ex => {
        ex.primaryMuscles.forEach(m => muscles.add(m));
        ex.secondaryMuscles.forEach(m => muscles.add(m));
    });
    return Array.from(muscles).sort();
};

export const getEquipmentTypes = () => {
    const equipment = new Set();
    exercises.forEach(ex => equipment.add(ex.equipment));
    return Array.from(equipment).sort();
};

export const getCategories = () => ['strength', 'cardio', 'stretching'];
export const getLevels = () => ['beginner', 'intermediate', 'advanced'];

export default exercises;
