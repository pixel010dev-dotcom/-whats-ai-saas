-- WhatsAI - Migration Inicial
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE "public"."TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRIAL', 'BLOCKED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."PlanType" AS ENUM ('BASICO', 'PROFISSIONAL', 'PREMIUM');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."ConversationStatus" AS ENUM ('ACTIVE', 'WAITING', 'CLOSED', 'TRANSFERRED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REFUNDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'PENDING');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."Tenant" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "cnpj" TEXT,
  "phone" TEXT,
  "status" "TenantStatus" DEFAULT 'TRIAL',
  "plan" "PlanType" DEFAULT 'BASICO',
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."TenantSettings" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL UNIQUE REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "businessHours" JSONB DEFAULT '{}',
  "welcomeMsg" TEXT,
  "aiPersonality" TEXT,
  "autoReply" BOOLEAN DEFAULT true,
  "workingDays" INTEGER DEFAULT 6,
  "workingStart" TEXT DEFAULT '08:00',
  "workingEnd" TEXT DEFAULT '18:00'
);

CREATE TABLE IF NOT EXISTS "public"."User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "password" TEXT,
  "image" TEXT,
  "role" TEXT DEFAULT 'owner',
  "tenantId" TEXT REFERENCES "public"."Tenant"("id"),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."Customer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "name" TEXT,
  "phone" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "notes" TEXT,
  "tags" TEXT[] DEFAULT '{}',
  "totalSpent" REAL DEFAULT 0,
  "totalOrders" INTEGER DEFAULT 0,
  "lastContact" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Customer_tenantId_idx" ON "public"."Customer"("tenantId");
CREATE INDEX IF NOT EXISTS "Customer_phone_idx" ON "public"."Customer"("phone");

CREATE TABLE IF NOT EXISTS "public"."Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "parentId" TEXT REFERENCES "public"."Category"("id"),
  "createdAt" TIMESTAMP DEFAULT now(),
  UNIQUE("tenantId", "name")
);

CREATE TABLE IF NOT EXISTS "public"."Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" REAL NOT NULL,
  "cost" REAL,
  "categoryId" TEXT REFERENCES "public"."Category"("id"),
  "image" TEXT,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Product_tenantId_idx" ON "public"."Product"("tenantId");

CREATE TABLE IF NOT EXISTS "public"."Conversation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "customerId" TEXT REFERENCES "public"."Customer"("id"),
  "status" "ConversationStatus" DEFAULT 'ACTIVE',
  "channel" TEXT DEFAULT 'whatsapp',
  "lastMessageAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Conversation_tenantId_idx" ON "public"."Conversation"("tenantId");
CREATE INDEX IF NOT EXISTS "Conversation_customerId_idx" ON "public"."Conversation"("customerId");

CREATE TABLE IF NOT EXISTS "public"."Message" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "conversationId" TEXT NOT NULL REFERENCES "public"."Conversation"("id") ON DELETE CASCADE,
  "role" TEXT DEFAULT 'user',
  "content" TEXT NOT NULL,
  "type" TEXT DEFAULT 'text',
  "metadata" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "public"."Message"("conversationId");

CREATE TABLE IF NOT EXISTS "public"."Knowledge" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "category" TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Knowledge_tenantId_idx" ON "public"."Knowledge"("tenantId");

CREATE TABLE IF NOT EXISTS "public"."WhatsApp" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id") ON DELETE CASCADE,
  "number" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "provider" TEXT DEFAULT 'evolution',
  "instance" TEXT,
  "connected" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "WhatsApp_tenantId_idx" ON "public"."WhatsApp"("tenantId");

CREATE TABLE IF NOT EXISTS "public"."Payment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id"),
  "amount" REAL NOT NULL,
  "currency" TEXT DEFAULT 'BRL',
  "status" "PaymentStatus" DEFAULT 'PENDING',
  "method" TEXT,
  "mpPaymentId" TEXT UNIQUE,
  "mpPreferenceId" TEXT,
  "description" TEXT,
  "paidAt" TIMESTAMP,
  "subscriptionId" TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Payment_tenantId_idx" ON "public"."Payment"("tenantId");
CREATE INDEX IF NOT EXISTS "Payment_mpPaymentId_idx" ON "public"."Payment"("mpPaymentId");

CREATE TABLE IF NOT EXISTS "public"."Subscription" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES "public"."Tenant"("id"),
  "plan" "PlanType" DEFAULT 'PROFISSIONAL',
  "status" "SubscriptionStatus" DEFAULT 'PENDING',
  "mpSubscriptionId" TEXT UNIQUE,
  "currentPeriodStart" TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Subscription_tenantId_idx" ON "public"."Subscription"("tenantId");

-- Enable Row Level Security
ALTER TABLE "public"."Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Conversation" ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own tenant" ON "public"."Tenant"
  FOR SELECT USING (id IN (SELECT "tenantId" FROM "public"."User" WHERE "tenantId" = id));

CREATE POLICY "Tenant can manage customers" ON "public"."Customer"
  FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM "public"."User" WHERE "tenantId" = "Customer"."tenantId"));
