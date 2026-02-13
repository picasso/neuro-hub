# Kysely Query Builder - Руководство по использованию

## Структура

- **Knex** (`db` из `@/lib/db`) - только для миграций и seeds
- **Kysely** (`kysely` из `@/lib/db`) - для всех запросов в приложении
- **Типы** (`src/types/database.ts`) - автогенерируются из схемы БД

## Workflow

```bash
# 1. Создать миграцию
yarn db:migrate:make add_new_table

# 2. Написать миграцию (используя Knex синтаксис)
# src/lib/db/migrations/TIMESTAMP_add_new_table.ts

# 3. Запустить миграцию
yarn db:migrate

# 4. Сгенерировать типы Kysely
yarn db:generate-types
```

## Примеры использования

### Select

```typescript
import { kysely } from '@/lib/db'

// Один пользователь
const user = await kysely
  .selectFrom('users')
  .selectAll()
  .where('email', '=', 'test@example.com')
  .executeTakeFirst()

// С JOIN
const users = await kysely
  .selectFrom('users')
  .innerJoin('user_profiles', 'users.id', 'user_profiles.user_id')
  .select(['users.id', 'users.email', 'user_profiles.name'])
  .where('users.role', '=', 'freelancer')
  .execute()
```

### Insert

```typescript
const newUser = await kysely
  .insertInto('users')
  .values({
    // Better Auth обычно создаёт users сам, но пример вставки оставляем для админ/скриптов.
    id: 'usr_example',
    email: 'new@example.com',
    name: 'New User',
    role: 'freelancer',
    emailVerified: false,
    image: null,
  })
  .returningAll()
  .executeTakeFirst()
```

### Update

```typescript
await kysely
  .updateTable('users')
  .set({
    emailVerified: true,
  })
  .where('id', '=', userId)
  .execute()
```

### Delete

```typescript
await kysely
  .deleteFrom('users')
  .where('id', '=', userId)
  .execute()
```

### Транзакции

```typescript
const result = await kysely.transaction().execute(async (trx) => {
  const user = await trx
    .insertInto('users')
    .values({
      id: 'usr_example_tx',
      email: 'tx@example.com',
      name: 'Tx User',
      role: 'client',
      emailVerified: false,
      image: null,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  await trx
    .insertInto('user_profiles')
    .values({ id: user.id, user_id: user.id, name: 'Test User' })
    .execute()

  return user
})
```

## Преимущества

- **Автокомплит**: IDE знает названия таблиц и колонок
- **Type-safe**: невозможно обратиться к несуществующей колонке
- **Compile-time проверки**: ошибки до запуска приложения
- **Immutable API**: каждый метод возвращает новый объект

## Важно

- ⚠️ НЕ используйте Knex (`db`) для запросов - только для миграций!
- ✅ Используйте Kysely (`kysely`) для всех запросов в коде приложения
- 🔄 После каждой миграции запускайте `yarn db:generate-types`
- 📝 Типы в `src/types/database.ts` генерируются автоматически, не редактируйте вручную
