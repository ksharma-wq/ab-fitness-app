import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Core Subscription Plans
  const plans = [
    {
      name: 'Silver',
      slug: 'silver',
      price: 999,
      duration: 1,
      tier: 'SILVER',
      description: 'Basic workout plans and access to home gym.',
      features: JSON.stringify(['Access to home gym', 'Basic workout plans', 'Locker access']),
      popular: false,
    },
    {
      name: 'Gold',
      slug: 'gold',
      price: 1999,
      duration: 1,
      tier: 'GOLD',
      description: 'Popular choice. All-India gym access and group classes.',
      features: JSON.stringify(['All-India gym access', 'Group fitness classes', 'Locker access', 'Premium workout plans']),
      popular: true,
    },
    {
      name: 'Platinum',
      slug: 'platinum',
      price: 3499,
      duration: 1,
      tier: 'PLATINUM',
      description: 'All-India gym access, 4 personal trainer sessions, nutrition plan.',
      features: JSON.stringify(['All-India gym access', '4 PT sessions/month', 'Custom nutrition plan', 'Unlimited group classes']),
      popular: false,
    }
  ]

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  // 2. Gym Locations
  const locations = [
    {
      name: 'AB Fitness Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '123 Link Road, Andheri West',
      amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe']),
      rating: 4.8,
    },
    {
      name: 'AB Fitness Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      address: 'Inner Circle, CP',
      amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Spa']),
      rating: 4.9,
    },
    {
      name: 'AB Fitness Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '100ft Road, Indiranagar',
      amenities: JSON.stringify(['Cardio Zone', 'CrossFit', 'Swimming Pool']),
      rating: 4.7,
    }
  ]

  for (const l of locations) {
    await prisma.gymLocation.create({
      data: l,
    })
  }

  // 3. Exercises
  const exercises = [
    {
      name: 'Barbell Bench Press',
      slug: 'barbell-bench-press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Lie on a flat bench. Unrack the barbell. Lower it to your mid-chest. Press it back up.',
      tips: JSON.stringify(['Keep your feet flat', 'Squeeze shoulder blades together']),
    },
    {
      name: 'Squat',
      slug: 'squat',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Stand with feet shoulder-width apart. Rest barbell on upper back. Bend knees and lower hips. Stand back up.',
      tips: JSON.stringify(['Keep chest up', 'Drive through heels']),
    },
    {
      name: 'Deadlift',
      slug: 'deadlift',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      instructions: 'Stand over barbell. Hinge at hips and grip bar. Keep back straight and pull bar up by extending hips and knees.',
      tips: JSON.stringify(['Keep bar close to body', 'Do not round lower back']),
    }
  ]

  const createdExercises = []
  for (const e of exercises) {
    const ex = await prisma.exercise.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    })
    createdExercises.push(ex)
  }

  // 4. Workout Plans
  const workoutPlan = await prisma.workoutPlan.upsert({
    where: { slug: 'full-body-blast' },
    update: {},
    create: {
      name: 'Full Body Blast',
      slug: 'full-body-blast',
      category: 'Strength',
      difficulty: 'Intermediate',
      duration: 60,
      calories: 500,
      description: 'A comprehensive full body workout targeting all major muscle groups.',
    }
  })

  // 5. Connect Exercises to Workout Plan
  let order = 1;
  for (const ex of createdExercises) {
    await prisma.workoutExercise.create({
      data: {
        workoutPlanId: workoutPlan.id,
        exerciseId: ex.id,
        sets: 3,
        reps: '10',
        restSeconds: 90,
        order: order++,
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
