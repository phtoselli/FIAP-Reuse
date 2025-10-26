# 🚀 CONFIGURAÇÃO RÁPIDA DO BANCO

## 1. Neon (Mais Fácil - 2 minutos)
1. Acesse: https://neon.tech
2. Clique "Sign up" (use GitHub)
3. Clique "Create Project"
4. Copie a "Connection String"

## 2. Configurar no Vercel
1. Vercel Dashboard > Settings > Environment Variables
2. Nome: DATABASE_URL
3. Valor: postgresql://user:password@host/database
4. Clique "Save"

## 3. Executar Migrações
1. Vercel Dashboard > Functions > Terminal
2. Execute:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 4. Redeploy
1. Vercel Dashboard > Deployments
2. Clique "Redeploy" no último deploy
