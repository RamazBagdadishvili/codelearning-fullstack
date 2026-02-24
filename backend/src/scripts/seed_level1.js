require('dotenv').config();
const { pool } = require('../config/db');

// Import Lesson Data Files
const c1p1 = require('./data/level1_course1_part1');
const c1p2 = require('./data/level1_course1_part2');
const c2 = require('./data/level1_course2');
const c3p1 = require('./data/level1_course3_part1');
const c3p2 = require('./data/level1_course3_part2');

const adminId = 'a0000000-0000-0000-0000-000000000001';

const courses = [
  {
    id: 'c0000000-0000-0000-0001-000000000001',
    title: 'ვების შესავალი და HTML სტრუქტურა',
    slug: 'intro-to-web-and-html-structure',
    description: 'ამ კურსში შეისწავლით ვებ-დეველოპმენტის ფუნდამენტებს. შეიტყობთ, როგორ მუშაობს ინტერნეტი და როგორ დაწეროთ პირველი სტანდარტული HTML5 კოდი სემანტიკისა და ვალიდაციის დაცვით.',
    short_description: 'ინტერნეტის მუშაობის პრინციპი და HTML მარკირების ენის საფუძვლები.',
    category: 'frontend',
    difficulty: 'beginner',
    level: 1,
    icon: 'Globe',
    color: '#e34f26',
    estimated_hours: 2,
    sort_order: 1,
    is_published: true,
    created_by: adminId
  },
  {
    id: 'c0000000-0000-0000-0001-000000000002',
    title: 'HTML ცხრილები',
    slug: 'html-tables',
    description: 'ისწავლეთ მონაცემების ტაბულარული წარმოდგენა. გაეცნობით ცხრილის സტრუქტურას (table, tr, td, th), როგორ გავაერთიანოთ უჯრედები colspan/rowspan-ით და როგორ ვაქციოთ ცხრილი ხელმისაწვდომი (accessible).',
    short_description: 'ცხრილების აგება, უჯრედების შერწყმა და მონაცემების ორგანიზება.',
    category: 'frontend',
    difficulty: 'beginner',
    level: 1,
    icon: 'Table',
    color: '#3498db',
    estimated_hours: 1,
    sort_order: 2,
    is_published: true,
    created_by: adminId
  },
  {
    id: 'c0000000-0000-0000-0001-000000000003',
    title: 'HTML ფორმები',
    slug: 'html-forms',
    description: 'დეტალური კურსი საიტის ინტᲣრაქციულ ნაწილზე. როგორ შევაგროვოთ მომხმარებლის ინფორმაცია, რა ტიპის ველები არსებობს (text, radio, checkbox), როგორ ვმართოთ მონაცემების ვალიდაცია და ხელმისაწვდომობა (label, fieldset).',
    short_description: 'ინტერაქტიული ფორმების შექმნა მომხმარებლისგან მონაცემების მისაღებად.',
    category: 'frontend',
    difficulty: 'beginner',
    level: 1,
    icon: 'FormInput',
    color: '#9b59b6',
    estimated_hours: 2,
    sort_order: 3,
    is_published: true,
    created_by: adminId
  }
];

const allLessons = [
  ...c1p1,
  ...c1p2,
  ...c2,
  ...c3p1,
  ...c3p2
];

async function seedLevel1() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Inserting Courses...');
    for (const course of courses) {
      await client.query(`
        INSERT INTO courses (
          id, title, slug, description, short_description, category, 
          difficulty, level, icon, color, estimated_hours, 
          sort_order, is_published, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color
      `, [
        course.id, course.title, course.slug, course.description,
        course.short_description, course.category, course.difficulty,
        course.level, course.icon, course.color, course.estimated_hours,
        course.sort_order, course.is_published, course.created_by
      ]);
    }

    console.log("Inserting " + allLessons.length + " Lessons...");
    for (const lesson of allLessons) {
      const challengeText = lesson.challenge_text || '';
      const starterCode = lesson.starter_code || '';
      const solutionCode = lesson.solution_code || '';
      const testCases = lesson.test_cases || null;

      console.log("Inserting Lesson: " + lesson.title + " (" + (lesson.content_type || 'NULL') + ")");
      try {
        await client.query(`
          INSERT INTO lessons (
            id, course_id, title, slug, content, content_type, 
            starter_code, solution_code, challenge_text, test_cases, 
            language, xp_reward, sort_order, estimated_minutes, is_published
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            content_type = EXCLUDED.content_type,
            challenge_text = EXCLUDED.challenge_text,
            starter_code = EXCLUDED.starter_code,
            solution_code = EXCLUDED.solution_code,
            test_cases = EXCLUDED.test_cases
        `, [
          lesson.id, lesson.course_id, lesson.title, lesson.slug,
          lesson.content, lesson.content_type, starterCode,
          solutionCode, challengeText, testCases, lesson.language,
          lesson.xp_reward, lesson.sort_order, lesson.estimated_minutes
        ]);
      } catch (insertErr) {
        console.error('CRITICAL FAILURE ON LESSON:', lesson.title);
        console.error('VALUE:', lesson.content_type);
        throw insertErr;
      }
    }

    console.log('Updating aggregates...');
    for (const course of courses) {
      await client.query(`
        UPDATE courses 
        SET 
          total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1),
          total_xp = COALESCE((SELECT SUM(xp_reward) FROM lessons WHERE course_id = $1), 0)
        WHERE id = $1
      `, [course.id]);
    }

    await client.query('COMMIT');
    console.log('✅ Level 1 Data successfully securely seeded!');
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('❌ GLOBAL ERROR:', err);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

seedLevel1();
