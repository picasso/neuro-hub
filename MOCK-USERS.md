# MOCK-USERS

Synthetic freelancers for local testing. All text and image filenames are fictional.

- Avatars on disk: `public/mock-users/avatars/mock-avatar-01.jpg` … `mock-avatar-15.jpg` (JPEG, quality 60)
- Portfolio files on disk: `public/mock-users/portfolio/mock-portfolio-ai-*.jpg` (60 images, JPEG quality 60). Regeneration hints: `public/mock-users/portfolio/ASSETS-TO-GENERATE.md`.
- URLs assume `yarn dev` at `http://localhost:3000`.
- Timestamps (`createdAt`, `updatedAt`, `created_at`, `updated_at`) are intentionally omitted; seed scripts should apply DB defaults.
- `users` uses Better Auth column names (camelCase). Other tables use snake_case per Kysely types.

```yaml
users:
  - users:
      id: "mock_ai_fl_01"
      email: "mock-ai-fl-01@neurogig.test"
      name: "Mira Chen"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-01.jpg"
    user_profiles:
      id: "mock_ai_fl_01"
      user_id: "mock_ai_fl_01"
      name: "Mira Chen"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-01.jpg"
      bio: "Concept artist for sci-fi and fantasy. I help teams visualize worlds before production commits to a direction."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000001"
      user_id: "mock_ai_fl_01"
      specialization: "AI concept art and key visuals"
      hourly_rate: 95
      availability: "full-time"
      experience: "Cinematic key art for games and short pitches. Fast iteration from thumbnails to polished stills with consistent characters and lighting."
    user_skills:
      - id: "us_mock_ai_fl_01_mj"
        user_id: "mock_ai_fl_01"
        skill_id: "00000000-0000-4000-8000-000000000101"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_01_sd"
        user_id: "mock_ai_fl_01"
        skill_id: "00000000-0000-4000-8000-000000000102"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_01_leo"
        user_id: "mock_ai_fl_01"
        skill_id: "00000000-0000-4000-8000-000000000105"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000001"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000001"
        title: "AI art sample 1-1"
        description: "Synthetic portfolio frame for AI art work by Mira. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-01.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000002"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000001"
        title: "AI avatar sample 1-2"
        description: "Synthetic portfolio frame for AI avatar work by Mira. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-01.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
      - id: "e0000000-0000-4000-8000-000000000003"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000001"
        title: "AI image editing sample 1-3"
        description: "Synthetic portfolio frame for AI image editing work by Mira. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-01.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000004"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000001"
        title: "AI agents sample 1-4"
        description: "Synthetic portfolio frame for AI agents work by Mira. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-01.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
  - users:
      id: "mock_ai_fl_02"
      email: "mock-ai-fl-02@neurogig.test"
      name: "Jordan Okoro"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-02.jpg"
    user_profiles:
      id: "mock_ai_fl_02"
      user_id: "mock_ai_fl_02"
      name: "Jordan Okoro"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-02.jpg"
      bio: "Designer-developer hybrid shipping onboarding, chat, and settings that make AI feel dependable."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000002"
      user_id: "mock_ai_fl_02"
      specialization: "AI-native mobile product UI"
      hourly_rate: 110
      availability: "part-time"
      experience: "Mobile flows with LLM features: progressive disclosure, safe fallbacks, and instrumentation for quality reviews."
    user_skills:
      - id: "us_mock_ai_fl_02_g4"
        user_id: "mock_ai_fl_02"
        skill_id: "00000000-0000-4000-8000-000000000001"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_02_oapi"
        user_id: "mock_ai_fl_02"
        skill_id: "00000000-0000-4000-8000-000000000402"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_02_pe"
        user_id: "mock_ai_fl_02"
        skill_id: "00000000-0000-4000-8000-000000000501"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000005"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000002"
        title: "AI mobile sample 2-1"
        description: "Synthetic portfolio frame for AI mobile work by Jordan. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-01.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000006"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000002"
        title: "AI video sample 2-2"
        description: "Synthetic portfolio frame for AI video work by Jordan. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-01.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
      - id: "e0000000-0000-4000-8000-000000000007"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000002"
        title: "AI art sample 2-3"
        description: "Synthetic portfolio frame for AI art work by Jordan. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-02.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000008"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000002"
        title: "AI avatar sample 2-4"
        description: "Synthetic portfolio frame for AI avatar work by Jordan. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-02.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
  - users:
      id: "mock_ai_fl_03"
      email: "mock-ai-fl-03@neurogig.test"
      name: "Elena Vasquez"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-03.jpg"
    user_profiles:
      id: "mock_ai_fl_03"
      user_id: "mock_ai_fl_03"
      name: "Elena Vasquez"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-03.jpg"
      bio: "I build copilots that ops teams trust: clear sources, tight tool permissions, and boring runbooks."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000003"
      user_id: "mock_ai_fl_03"
      specialization: "AI agents for support and operations"
      hourly_rate: 120
      availability: "full-time"
      experience: "Grounded agents with citations, human handoff, and evaluation loops. Focus on measurable deflection without risky automation."
    user_skills:
      - id: "us_mock_ai_fl_03_lc"
        user_id: "mock_ai_fl_03"
        skill_id: "00000000-0000-4000-8000-000000000401"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_03_rag"
        user_id: "mock_ai_fl_03"
        skill_id: "00000000-0000-4000-8000-000000000406"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_03_vdb"
        user_id: "mock_ai_fl_03"
        skill_id: "00000000-0000-4000-8000-000000000405"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000009"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000003"
        title: "AI image editing sample 3-1"
        description: "Synthetic portfolio frame for AI image editing work by Elena. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-02.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000010"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000003"
        title: "AI agents sample 3-2"
        description: "Synthetic portfolio frame for AI agents work by Elena. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-02.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
      - id: "e0000000-0000-4000-8000-000000000011"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000003"
        title: "AI mobile sample 3-3"
        description: "Synthetic portfolio frame for AI mobile work by Elena. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-02.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000012"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000003"
        title: "AI video sample 3-4"
        description: "Synthetic portfolio frame for AI video work by Elena. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-02.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
  - users:
      id: "mock_ai_fl_04"
      email: "mock-ai-fl-04@neurogig.test"
      name: "Samir Patel"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-04.jpg"
    user_profiles:
      id: "mock_ai_fl_04"
      user_id: "mock_ai_fl_04"
      name: "Samir Patel"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-04.jpg"
      bio: "Editor for ecommerce and creators who need clean edges, honest skin, and consistent color."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000004"
      user_id: "mock_ai_fl_04"
      specialization: "AI-assisted retouching and compositing"
      hourly_rate: 65
      availability: "weekends only"
      experience: "Catalog and portrait edits with believable texture. Generative passes for backgrounds and cleanup when Photoshop alone is slow."
    user_skills:
      - id: "us_mock_ai_fl_04_d3"
        user_id: "mock_ai_fl_04"
        skill_id: "00000000-0000-4000-8000-000000000103"
        proficiency_level: "intermediate"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_04_ff"
        user_id: "mock_ai_fl_04"
        skill_id: "00000000-0000-4000-8000-000000000106"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_04_id"
        user_id: "mock_ai_fl_04"
        skill_id: "00000000-0000-4000-8000-000000000107"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000013"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000004"
        title: "AI art sample 4-1"
        description: "Synthetic portfolio frame for AI art work by Samir. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-03.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000014"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000004"
        title: "AI avatar sample 4-2"
        description: "Synthetic portfolio frame for AI avatar work by Samir. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-03.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
      - id: "e0000000-0000-4000-8000-000000000015"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000004"
        title: "AI image editing sample 4-3"
        description: "Synthetic portfolio frame for AI image editing work by Samir. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-03.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000016"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000004"
        title: "AI agents sample 4-4"
        description: "Synthetic portfolio frame for AI agents work by Samir. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-03.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
  - users:
      id: "mock_ai_fl_05"
      email: "mock-ai-fl-05@neurogig.test"
      name: "Nina Kowalski"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-05.jpg"
    user_profiles:
      id: "mock_ai_fl_05"
      user_id: "mock_ai_fl_05"
      name: "Nina Kowalski"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-05.jpg"
      bio: "Character designer blending paintover with diffusion exploration to keep identity stable."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000005"
      user_id: "mock_ai_fl_05"
      specialization: "AI avatars and character packs"
      hourly_rate: 85
      availability: "part-time"
      experience: "Stream-ready characters: readable silhouettes, expression sheets, and palette-locked variants."
    user_skills:
      - id: "us_mock_ai_fl_05_mj"
        user_id: "mock_ai_fl_05"
        skill_id: "00000000-0000-4000-8000-000000000101"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_05_sd"
        user_id: "mock_ai_fl_05"
        skill_id: "00000000-0000-4000-8000-000000000102"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_05_leo"
        user_id: "mock_ai_fl_05"
        skill_id: "00000000-0000-4000-8000-000000000105"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000017"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000005"
        title: "AI mobile sample 5-1"
        description: "Synthetic portfolio frame for AI mobile work by Nina. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-03.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000018"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000005"
        title: "AI video sample 5-2"
        description: "Synthetic portfolio frame for AI video work by Nina. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-03.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
      - id: "e0000000-0000-4000-8000-000000000019"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000005"
        title: "AI art sample 5-3"
        description: "Synthetic portfolio frame for AI art work by Nina. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-04.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000020"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000005"
        title: "AI avatar sample 5-4"
        description: "Synthetic portfolio frame for AI avatar work by Nina. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-04.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
  - users:
      id: "mock_ai_fl_06"
      email: "mock-ai-fl-06@neurogig.test"
      name: "Theo Marin"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-06.jpg"
    user_profiles:
      id: "mock_ai_fl_06"
      user_id: "mock_ai_fl_06"
      name: "Theo Marin"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-06.jpg"
      bio: "Motion-minded generalist: I keep edits punchy and legible on phones."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000006"
      user_id: "mock_ai_fl_06"
      specialization: "AI video for ads and social"
      hourly_rate: 90
      availability: "full-time"
      experience: "Short promos, B-roll augmentation, and storyboard-to-motion experiments with tight brand-safe palettes."
    user_skills:
      - id: "us_mock_ai_fl_06_rw3"
        user_id: "mock_ai_fl_06"
        skill_id: "00000000-0000-4000-8000-000000000201"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_06_pika"
        user_id: "mock_ai_fl_06"
        skill_id: "00000000-0000-4000-8000-000000000203"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_06_syn"
        user_id: "mock_ai_fl_06"
        skill_id: "00000000-0000-4000-8000-000000000204"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000021"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000006"
        title: "AI image editing sample 6-1"
        description: "Synthetic portfolio frame for AI image editing work by Theo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-04.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000022"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000006"
        title: "AI agents sample 6-2"
        description: "Synthetic portfolio frame for AI agents work by Theo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-04.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
      - id: "e0000000-0000-4000-8000-000000000023"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000006"
        title: "AI mobile sample 6-3"
        description: "Synthetic portfolio frame for AI mobile work by Theo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-04.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000024"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000006"
        title: "AI video sample 6-4"
        description: "Synthetic portfolio frame for AI video work by Theo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-04.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
  - users:
      id: "mock_ai_fl_07"
      email: "mock-ai-fl-07@neurogig.test"
      name: "Riley Brooks"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-07.jpg"
    user_profiles:
      id: "mock_ai_fl_07"
      user_id: "mock_ai_fl_07"
      name: "Riley Brooks"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-07.jpg"
      bio: "I ship assistants that fail gracefully and log what happened for engineers."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000007"
      user_id: "mock_ai_fl_07"
      specialization: "Chatbots and LLM app integration"
      hourly_rate: 100
      availability: "part-time"
      experience: "Tool-calling patterns, structured outputs, and guardrails for customer-facing assistants."
    user_skills:
      - id: "us_mock_ai_fl_07_c35"
        user_id: "mock_ai_fl_07"
        skill_id: "00000000-0000-4000-8000-000000000003"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_07_aapi"
        user_id: "mock_ai_fl_07"
        skill_id: "00000000-0000-4000-8000-000000000403"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_07_oapi"
        user_id: "mock_ai_fl_07"
        skill_id: "00000000-0000-4000-8000-000000000402"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000025"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000007"
        title: "AI art sample 7-1"
        description: "Synthetic portfolio frame for AI art work by Riley. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-05.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000026"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000007"
        title: "AI avatar sample 7-2"
        description: "Synthetic portfolio frame for AI avatar work by Riley. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-05.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
      - id: "e0000000-0000-4000-8000-000000000027"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000007"
        title: "AI image editing sample 7-3"
        description: "Synthetic portfolio frame for AI image editing work by Riley. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-05.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000028"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000007"
        title: "AI agents sample 7-4"
        description: "Synthetic portfolio frame for AI agents work by Riley. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-05.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
  - users:
      id: "mock_ai_fl_08"
      email: "mock-ai-fl-08@neurogig.test"
      name: "Fatima Al-Farsi"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-08.jpg"
    user_profiles:
      id: "mock_ai_fl_08"
      user_id: "mock_ai_fl_08"
      name: "Fatima Al-Farsi"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-08.jpg"
      bio: "Brand illustrator using AI for speed and hand paint for final cohesion."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000008"
      user_id: "mock_ai_fl_08"
      specialization: "AI illustration for brand campaigns"
      hourly_rate: 78
      availability: "full-time"
      experience: "Campaign illustration systems: motifs, color ramps, and reusable backgrounds for marketing teams."
    user_skills:
      - id: "us_mock_ai_fl_08_mj"
        user_id: "mock_ai_fl_08"
        skill_id: "00000000-0000-4000-8000-000000000101"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_08_ff"
        user_id: "mock_ai_fl_08"
        skill_id: "00000000-0000-4000-8000-000000000106"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_08_pe"
        user_id: "mock_ai_fl_08"
        skill_id: "00000000-0000-4000-8000-000000000501"
        proficiency_level: "expert"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000029"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000008"
        title: "AI mobile sample 8-1"
        description: "Synthetic portfolio frame for AI mobile work by Fatima. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-05.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000030"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000008"
        title: "AI video sample 8-2"
        description: "Synthetic portfolio frame for AI video work by Fatima. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-05.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
      - id: "e0000000-0000-4000-8000-000000000031"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000008"
        title: "AI art sample 8-3"
        description: "Synthetic portfolio frame for AI art work by Fatima. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-06.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000032"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000008"
        title: "AI avatar sample 8-4"
        description: "Synthetic portfolio frame for AI avatar work by Fatima. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-06.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
  - users:
      id: "mock_ai_fl_09"
      email: "mock-ai-fl-09@neurogig.test"
      name: "Owen Kelly"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-09.jpg"
    user_profiles:
      id: "mock_ai_fl_09"
      user_id: "mock_ai_fl_09"
      name: "Owen Kelly"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-09.jpg"
      bio: "Compositor who likes difficult edges: glass, hair, and messy practical sets."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000009"
      user_id: "mock_ai_fl_09"
      specialization: "Compositing and scene rebuilds"
      hourly_rate: 72
      availability: "limited ~20h/wk"
      experience: "Complex masking, relighting, and environment rebuilds for hero marketing frames."
    user_skills:
      - id: "us_mock_ai_fl_09_sd"
        user_id: "mock_ai_fl_09"
        skill_id: "00000000-0000-4000-8000-000000000102"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_09_d3"
        user_id: "mock_ai_fl_09"
        skill_id: "00000000-0000-4000-8000-000000000103"
        proficiency_level: "intermediate"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_09_leo"
        user_id: "mock_ai_fl_09"
        skill_id: "00000000-0000-4000-8000-000000000105"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000033"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000009"
        title: "AI image editing sample 9-1"
        description: "Synthetic portfolio frame for AI image editing work by Owen. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-06.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000034"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000009"
        title: "AI agents sample 9-2"
        description: "Synthetic portfolio frame for AI agents work by Owen. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-06.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
      - id: "e0000000-0000-4000-8000-000000000035"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000009"
        title: "AI mobile sample 9-3"
        description: "Synthetic portfolio frame for AI mobile work by Owen. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-06.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000036"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000009"
        title: "AI video sample 9-4"
        description: "Synthetic portfolio frame for AI video work by Owen. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-06.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
  - users:
      id: "mock_ai_fl_10"
      email: "mock-ai-fl-10@neurogig.test"
      name: "Aisha Rahman"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-10.jpg"
    user_profiles:
      id: "mock_ai_fl_10"
      user_id: "mock_ai_fl_10"
      name: "Aisha Rahman"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-10.jpg"
      bio: "I make internal search feel magical but traceable: citations, permissions, and audit trails."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000010"
      user_id: "mock_ai_fl_10"
      specialization: "Enterprise RAG and knowledge assistants"
      hourly_rate: 130
      availability: "full-time"
      experience: "Chunking strategies, access control, evaluation sets, and red-team prompts for regulated teams."
    user_skills:
      - id: "us_mock_ai_fl_10_rag"
        user_id: "mock_ai_fl_10"
        skill_id: "00000000-0000-4000-8000-000000000406"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_10_ft"
        user_id: "mock_ai_fl_10"
        skill_id: "00000000-0000-4000-8000-000000000407"
        proficiency_level: "intermediate"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_10_g4t"
        user_id: "mock_ai_fl_10"
        skill_id: "00000000-0000-4000-8000-000000000002"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000037"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000010"
        title: "AI art sample 10-1"
        description: "Synthetic portfolio frame for AI art work by Aisha. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-07.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000038"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000010"
        title: "AI avatar sample 10-2"
        description: "Synthetic portfolio frame for AI avatar work by Aisha. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-07.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
      - id: "e0000000-0000-4000-8000-000000000039"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000010"
        title: "AI image editing sample 10-3"
        description: "Synthetic portfolio frame for AI image editing work by Aisha. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-07.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000040"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000010"
        title: "AI agents sample 10-4"
        description: "Synthetic portfolio frame for AI agents work by Aisha. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-07.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
  - users:
      id: "mock_ai_fl_11"
      email: "mock-ai-fl-11@neurogig.test"
      name: "Leo Schmidt"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-11.jpg"
    user_profiles:
      id: "mock_ai_fl_11"
      user_id: "mock_ai_fl_11"
      name: "Leo Schmidt"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-11.jpg"
      bio: "I design orchestration UIs that show what the agent did and what needs a human."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000011"
      user_id: "mock_ai_fl_11"
      specialization: "Automation UX and agent orchestration"
      hourly_rate: 88
      availability: "part-time"
      experience: "Multi-step workflows with approvals, retries, and operator dashboards for non-developers."
    user_skills:
      - id: "us_mock_ai_fl_11_lc"
        user_id: "mock_ai_fl_11"
        skill_id: "00000000-0000-4000-8000-000000000401"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_11_oapi"
        user_id: "mock_ai_fl_11"
        skill_id: "00000000-0000-4000-8000-000000000402"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_11_hf"
        user_id: "mock_ai_fl_11"
        skill_id: "00000000-0000-4000-8000-000000000404"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000041"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000011"
        title: "AI mobile sample 11-1"
        description: "Synthetic portfolio frame for AI mobile work by Leo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-07.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000042"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000011"
        title: "AI video sample 11-2"
        description: "Synthetic portfolio frame for AI video work by Leo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-07.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
      - id: "e0000000-0000-4000-8000-000000000043"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000011"
        title: "AI art sample 11-3"
        description: "Synthetic portfolio frame for AI art work by Leo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-08.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000044"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000011"
        title: "AI avatar sample 11-4"
        description: "Synthetic portfolio frame for AI avatar work by Leo. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-08.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
  - users:
      id: "mock_ai_fl_12"
      email: "mock-ai-fl-12@neurogig.test"
      name: "Camila Rios"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-12.jpg"
    user_profiles:
      id: "mock_ai_fl_12"
      user_id: "mock_ai_fl_12"
      name: "Camila Rios"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-12.jpg"
      bio: "Game art generalist: I keep assets readable in-engine and on store pages."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000012"
      user_id: "mock_ai_fl_12"
      specialization: "AI game props and environment tiles"
      hourly_rate: 58
      availability: "full-time"
      experience: "Stylized props, trim sheets, and mood explorations for small studios on tight schedules."
    user_skills:
      - id: "us_mock_ai_fl_12_sd"
        user_id: "mock_ai_fl_12"
        skill_id: "00000000-0000-4000-8000-000000000102"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_12_leo"
        user_id: "mock_ai_fl_12"
        skill_id: "00000000-0000-4000-8000-000000000105"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_12_mj"
        user_id: "mock_ai_fl_12"
        skill_id: "00000000-0000-4000-8000-000000000101"
        proficiency_level: "intermediate"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000045"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000012"
        title: "AI image editing sample 12-1"
        description: "Synthetic portfolio frame for AI image editing work by Camila. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-08.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000046"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000012"
        title: "AI agents sample 12-2"
        description: "Synthetic portfolio frame for AI agents work by Camila. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-08.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
      - id: "e0000000-0000-4000-8000-000000000047"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000012"
        title: "AI mobile sample 12-3"
        description: "Synthetic portfolio frame for AI mobile work by Camila. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-08.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000048"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000012"
        title: "AI video sample 12-4"
        description: "Synthetic portfolio frame for AI video work by Camila. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-08.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
  - users:
      id: "mock_ai_fl_13"
      email: "mock-ai-fl-13@neurogig.test"
      name: "Dmitri Volkov"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-13.jpg"
    user_profiles:
      id: "mock_ai_fl_13"
      user_id: "mock_ai_fl_13"
      name: "Dmitri Volkov"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-13.jpg"
      bio: "Audio-first storyteller using generative tools for fast alternates."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000013"
      user_id: "mock_ai_fl_13"
      specialization: "AI audio plus video sync packs"
      hourly_rate: 92
      availability: "part-time"
      experience: "Voiceover beds, short sonic logos, and vertical cuts aligned to beat markers."
    user_skills:
      - id: "us_mock_ai_fl_13_el"
        user_id: "mock_ai_fl_13"
        skill_id: "00000000-0000-4000-8000-000000000301"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_13_suno"
        user_id: "mock_ai_fl_13"
        skill_id: "00000000-0000-4000-8000-000000000303"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_13_rw2"
        user_id: "mock_ai_fl_13"
        skill_id: "00000000-0000-4000-8000-000000000202"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000049"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000013"
        title: "AI art sample 13-1"
        description: "Synthetic portfolio frame for AI art work by Dmitri. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-09.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000050"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000013"
        title: "AI avatar sample 13-2"
        description: "Synthetic portfolio frame for AI avatar work by Dmitri. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-09.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
      - id: "e0000000-0000-4000-8000-000000000051"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000013"
        title: "AI image editing sample 13-3"
        description: "Synthetic portfolio frame for AI image editing work by Dmitri. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-09.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000052"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000013"
        title: "AI agents sample 13-4"
        description: "Synthetic portfolio frame for AI agents work by Dmitri. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-09.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
  - users:
      id: "mock_ai_fl_14"
      email: "mock-ai-fl-14@neurogig.test"
      name: "Hannah Ng"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-14.jpg"
    user_profiles:
      id: "mock_ai_fl_14"
      user_id: "mock_ai_fl_14"
      name: "Hannah Ng"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-14.jpg"
      bio: "Product designer for mobile teams shipping subtle AI without overwhelming settings."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000014"
      user_id: "mock_ai_fl_14"
      specialization: "Mobile UX for AI features"
      hourly_rate: 105
      availability: "full-time"
      experience: "Habit-forming loops for assistants: reminders, summaries, and offline-first shells."
    user_skills:
      - id: "us_mock_ai_fl_14_gem"
        user_id: "mock_ai_fl_14"
        skill_id: "00000000-0000-4000-8000-000000000005"
        proficiency_level: "intermediate"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_14_oapi"
        user_id: "mock_ai_fl_14"
        skill_id: "00000000-0000-4000-8000-000000000402"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_14_pe"
        user_id: "mock_ai_fl_14"
        skill_id: "00000000-0000-4000-8000-000000000501"
        proficiency_level: "advanced"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000053"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000014"
        title: "AI mobile sample 14-1"
        description: "Synthetic portfolio frame for AI mobile work by Hannah. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-09.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000054"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000014"
        title: "AI video sample 14-2"
        description: "Synthetic portfolio frame for AI video work by Hannah. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-09.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
      - id: "e0000000-0000-4000-8000-000000000055"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000014"
        title: "AI art sample 14-3"
        description: "Synthetic portfolio frame for AI art work by Hannah. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-art-10.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "image_generation"
        tools_used:
          - "Midjourney"
          - "Photoshop"
      - id: "e0000000-0000-4000-8000-000000000056"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000014"
        title: "AI avatar sample 14-4"
        description: "Synthetic portfolio frame for AI avatar work by Hannah. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-avatar-10.jpg"
        media_type: "image/jpeg"
        media_width: 1024
        media_height: 1024
        caption: null
        category: "image_generation"
        tools_used:
          - "Stable Diffusion"
          - "Clip Studio Paint"
  - users:
      id: "mock_ai_fl_15"
      email: "mock-ai-fl-15@neurogig.test"
      name: "Alex Rivera"
      role: freelancer
      emailVerified: true
      image: "http://localhost:3000/mock-users/avatars/mock-avatar-15.jpg"
    user_profiles:
      id: "mock_ai_fl_15"
      user_id: "mock_ai_fl_15"
      name: "Alex Rivera"
      avatar_url: "http://localhost:3000/mock-users/avatars/mock-avatar-15.jpg"
      bio: "I help leaders ship AI without chaos: governance, metrics, and coaching."
      company_name: null
      company_role: null
    freelancer_profiles:
      id: "f0000000-0000-4000-8000-000000000015"
      user_id: "mock_ai_fl_15"
      specialization: "Prompt systems and AI strategy"
      hourly_rate: 140
      availability: "2 client slots"
      experience: "Playbooks for evaluation, vendor selection, and team training with realistic ROI framing."
    user_skills:
      - id: "us_mock_ai_fl_15_str"
        user_id: "mock_ai_fl_15"
        skill_id: "00000000-0000-4000-8000-000000000502"
        proficiency_level: "expert"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_15_trn"
        user_id: "mock_ai_fl_15"
        skill_id: "00000000-0000-4000-8000-000000000503"
        proficiency_level: "advanced"
        legacy_skill_id: null
      - id: "us_mock_ai_fl_15_pe"
        user_id: "mock_ai_fl_15"
        skill_id: "00000000-0000-4000-8000-000000000501"
        proficiency_level: "expert"
        legacy_skill_id: null
    portfolio_items:
      - id: "e0000000-0000-4000-8000-000000000057"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000015"
        title: "AI image editing sample 15-1"
        description: "Synthetic portfolio frame for AI image editing work by Alex. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-edit-10.jpg"
        media_type: "image/jpeg"
        media_width: 2048
        media_height: 1365
        caption: null
        category: "image_generation"
        tools_used:
          - "Photoshop"
          - "Lightroom"
      - id: "e0000000-0000-4000-8000-000000000058"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000015"
        title: "AI agents sample 15-2"
        description: "Synthetic portfolio frame for AI agents work by Alex. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-agent-10.jpg"
        media_type: "image/jpeg"
        media_width: 1680
        media_height: 1050
        caption: null
        category: "programming"
        tools_used:
          - "LangChain"
          - "OpenAI API"
      - id: "e0000000-0000-4000-8000-000000000059"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000015"
        title: "AI mobile sample 15-3"
        description: "Synthetic portfolio frame for AI mobile work by Alex. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-mobile-10.jpg"
        media_type: "image/jpeg"
        media_width: 1290
        media_height: 2796
        caption: null
        category: "programming"
        tools_used:
          - "Figma"
          - "SwiftUI"
      - id: "e0000000-0000-4000-8000-000000000060"
        freelancer_profile_id: "f0000000-0000-4000-8000-000000000015"
        title: "AI video sample 15-4"
        description: "Synthetic portfolio frame for AI video work by Alex. Intended for local QA only."
        media_url: "http://localhost:3000/mock-users/portfolio/mock-portfolio-ai-video-10.jpg"
        media_type: "image/jpeg"
        media_width: 1920
        media_height: 1080
        caption: null
        category: "video_generation"
        tools_used:
          - "Runway Gen-3"
          - "DaVinci Resolve"
```
