CREATE TYPE "public"."board_type" AS ENUM('regular', 'template');--> statement-breakpoint
CREATE TYPE "public"."board_visibility" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "public"."card_activity_type" AS ENUM('card.created', 'card.updated.title', 'card.updated.description', 'card.updated.index', 'card.updated.list', 'card.updated.label.added', 'card.updated.label.removed', 'card.updated.member.added', 'card.updated.member.removed', 'card.updated.comment.added', 'card.updated.comment.updated', 'card.updated.comment.deleted', 'card.updated.checklist.added', 'card.updated.checklist.renamed', 'card.updated.checklist.deleted', 'card.updated.checklist.item.added', 'card.updated.checklist.item.updated', 'card.updated.checklist.item.completed', 'card.updated.checklist.item.uncompleted', 'card.updated.checklist.item.deleted', 'card.updated.attachment.added', 'card.updated.attachment.removed', 'card.updated.dueDate.added', 'card.updated.dueDate.updated', 'card.updated.dueDate.removed', 'card.archived');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('trello');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('started', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'member', 'guest');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('invited', 'active', 'removed', 'paused');--> statement-breakpoint
CREATE TYPE "public"."slug_type" AS ENUM('reserved', 'premium');--> statement-breakpoint
CREATE TYPE "public"."workspace_plan" AS ENUM('free', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."invite_link_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('mention', 'workspace.member.added', 'workspace.member.removed', 'workspace.role.changed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" uuid NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "apiKey" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"userId" uuid NOT NULL,
	"refillInterval" integer,
	"refillAmount" integer,
	"lastRefillAt" timestamp,
	"enabled" boolean,
	"rateLimitEnabled" boolean,
	"rateLimitTimeWindow" integer,
	"rateLimitMax" integer,
	"requestCount" integer,
	"remaining" integer,
	"lastRequest" timestamp,
	"expiresAt" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
ALTER TABLE "apiKey" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verification" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "board" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	"importId" bigint,
	"workspaceId" bigint NOT NULL,
	"visibility" "board_visibility" DEFAULT 'private' NOT NULL,
	"type" "board_type" DEFAULT 'regular' NOT NULL,
	"sourceBoardId" bigint,
	CONSTRAINT "board_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "board" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_board_favorites" (
	"userId" uuid NOT NULL,
	"boardId" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_board_favorites_userId_boardId_pk" PRIMARY KEY("userId","boardId")
);
--> statement-breakpoint
CREATE TABLE "card_activity" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"type" "card_activity_type" NOT NULL,
	"cardId" bigint NOT NULL,
	"fromIndex" integer,
	"toIndex" integer,
	"fromListId" bigint,
	"toListId" bigint,
	"labelId" bigint,
	"workspaceMemberId" bigint,
	"fromTitle" text,
	"toTitle" text,
	"fromDescription" text,
	"toDescription" text,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"commentId" bigint,
	"fromComment" text,
	"toComment" text,
	"fromDueDate" timestamp,
	"toDueDate" timestamp,
	"sourceBoardId" bigint,
	"attachmentId" bigint,
	CONSTRAINT "card_activity_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card_activity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "card_attachment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"cardId" bigint NOT NULL,
	"filename" varchar(255) NOT NULL,
	"originalFilename" varchar(255) NOT NULL,
	"contentType" varchar(100) NOT NULL,
	"size" bigint NOT NULL,
	"s3Key" varchar(500) NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "card_attachment_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card_attachment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "_card_workspace_members" (
	"cardId" bigint NOT NULL,
	"workspaceMemberId" bigint NOT NULL,
	CONSTRAINT "_card_workspace_members_cardId_workspaceMemberId_pk" PRIMARY KEY("cardId","workspaceMemberId")
);
--> statement-breakpoint
ALTER TABLE "_card_workspace_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "card" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"index" integer NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	"listId" bigint NOT NULL,
	"importId" bigint,
	"dueDate" timestamp,
	CONSTRAINT "card_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "_card_labels" (
	"cardId" bigint NOT NULL,
	"labelId" bigint NOT NULL,
	CONSTRAINT "_card_labels_cardId_labelId_pk" PRIMARY KEY("cardId","labelId")
);
--> statement-breakpoint
ALTER TABLE "_card_labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "card_comments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"comment" text NOT NULL,
	"cardId" bigint NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	CONSTRAINT "card_comments_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "card_checklist_item" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"title" varchar(500) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"index" integer NOT NULL,
	"checklistId" bigint NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	CONSTRAINT "card_checklist_item_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card_checklist_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "card_checklist" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"index" integer NOT NULL,
	"cardId" bigint NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	CONSTRAINT "card_checklist_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "card_checklist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"feedback" text NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"url" text NOT NULL,
	"reviewed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "import" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"source" "source" NOT NULL,
	"status" "status" NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "import_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "import" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "label" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"colourCode" varchar(12),
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"boardId" bigint NOT NULL,
	"importId" bigint,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	CONSTRAINT "label_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "label" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "list" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"index" integer NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	"boardId" bigint NOT NULL,
	"importId" bigint,
	CONSTRAINT "list_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "list" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"stripeCustomerId" varchar(255),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "integration" (
	"provider" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	"accessToken" varchar(255) NOT NULL,
	"refreshToken" varchar(255),
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "integration_pkey" PRIMARY KEY("userId","provider")
);
--> statement-breakpoint
ALTER TABLE "integration" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_slug_checks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"available" boolean NOT NULL,
	"reserved" boolean NOT NULL,
	"workspaceId" bigint,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_slug_checks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_slugs" (
	"slug" varchar(255) NOT NULL,
	"type" "slug_type" NOT NULL,
	CONSTRAINT "workspace_slugs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"email" varchar(255) NOT NULL,
	"userId" uuid,
	"workspaceId" bigint NOT NULL,
	"createdBy" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	"role" "role" NOT NULL,
	"roleId" bigint,
	"status" "member_status" DEFAULT 'invited' NOT NULL,
	CONSTRAINT "workspace_members_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"plan" "workspace_plan" DEFAULT 'free' NOT NULL,
	"showEmailsToMembers" boolean DEFAULT true NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	"deletedBy" uuid,
	CONSTRAINT "workspace_publicId_unique" UNIQUE("publicId"),
	CONSTRAINT "workspace_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "workspace" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"plan" varchar(255) NOT NULL,
	"referenceId" varchar(12),
	"stripeCustomerId" varchar(255),
	"stripeSubscriptionId" varchar(255),
	"status" varchar(255) NOT NULL,
	"periodStart" timestamp,
	"periodEnd" timestamp,
	"cancelAtPeriodEnd" boolean,
	"seats" integer,
	"unlimitedSeats" boolean DEFAULT false NOT NULL,
	"trialStart" timestamp,
	"trialEnd" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_invite_links" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"workspaceId" bigint NOT NULL,
	"code" varchar(12) NOT NULL,
	"status" "invite_link_status" DEFAULT 'active' NOT NULL,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" uuid,
	"updatedAt" timestamp,
	"updatedBy" uuid,
	CONSTRAINT "workspace_invite_links_publicId_unique" UNIQUE("publicId"),
	CONSTRAINT "workspace_invite_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "workspace_invite_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_member_permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"workspaceMemberId" bigint NOT NULL,
	"permission" varchar(64) NOT NULL,
	"granted" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "workspace_member_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_role_permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"workspaceRoleId" bigint NOT NULL,
	"permission" varchar(64) NOT NULL,
	"granted" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_role_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"workspaceId" bigint NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(255),
	"hierarchyLevel" integer NOT NULL,
	"isSystem" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "workspace_roles_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "workspace_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notification" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"type" "notification_type" NOT NULL,
	"userId" uuid NOT NULL,
	"cardId" bigint,
	"commentId" bigint,
	"workspaceId" bigint,
	"metadata" text,
	"readAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "notification_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "notification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_webhooks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"publicId" varchar(12) NOT NULL,
	"workspaceId" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"secret" text,
	"events" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdBy" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "workspace_webhooks_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
ALTER TABLE "workspace_webhooks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_importId_import_id_fk" FOREIGN KEY ("importId") REFERENCES "public"."import"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_board_favorites" ADD CONSTRAINT "user_board_favorites_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_board_favorites" ADD CONSTRAINT "user_board_favorites_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_fromListId_list_id_fk" FOREIGN KEY ("fromListId") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_toListId_list_id_fk" FOREIGN KEY ("toListId") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_labelId_label_id_fk" FOREIGN KEY ("labelId") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_workspaceMemberId_workspace_members_id_fk" FOREIGN KEY ("workspaceMemberId") REFERENCES "public"."workspace_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_commentId_card_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."card_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_sourceBoardId_board_id_fk" FOREIGN KEY ("sourceBoardId") REFERENCES "public"."board"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_activity" ADD CONSTRAINT "card_activity_attachmentId_card_attachment_id_fk" FOREIGN KEY ("attachmentId") REFERENCES "public"."card_attachment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_attachment" ADD CONSTRAINT "card_attachment_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_attachment" ADD CONSTRAINT "card_attachment_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_card_workspace_members" ADD CONSTRAINT "_card_workspace_members_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_card_workspace_members" ADD CONSTRAINT "_card_workspace_members_workspaceMemberId_workspace_members_id_fk" FOREIGN KEY ("workspaceMemberId") REFERENCES "public"."workspace_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_listId_list_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_importId_import_id_fk" FOREIGN KEY ("importId") REFERENCES "public"."import"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_card_labels" ADD CONSTRAINT "_card_labels_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_card_labels" ADD CONSTRAINT "_card_labels_labelId_label_id_fk" FOREIGN KEY ("labelId") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_comments" ADD CONSTRAINT "card_comments_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_comments" ADD CONSTRAINT "card_comments_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_comments" ADD CONSTRAINT "card_comments_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist_item" ADD CONSTRAINT "card_checklist_item_checklistId_card_checklist_id_fk" FOREIGN KEY ("checklistId") REFERENCES "public"."card_checklist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist_item" ADD CONSTRAINT "card_checklist_item_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist_item" ADD CONSTRAINT "card_checklist_item_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist" ADD CONSTRAINT "card_checklist_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist" ADD CONSTRAINT "card_checklist_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_checklist" ADD CONSTRAINT "card_checklist_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import" ADD CONSTRAINT "import_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_importId_import_id_fk" FOREIGN KEY ("importId") REFERENCES "public"."import"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_importId_import_id_fk" FOREIGN KEY ("importId") REFERENCES "public"."import"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration" ADD CONSTRAINT "integration_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_slug_checks" ADD CONSTRAINT "workspace_slug_checks_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_slug_checks" ADD CONSTRAINT "workspace_slug_checks_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_roleId_workspace_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."workspace_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_deletedBy_user_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_referenceId_workspace_publicId_fk" FOREIGN KEY ("referenceId") REFERENCES "public"."workspace"("publicId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invite_links" ADD CONSTRAINT "workspace_invite_links_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invite_links" ADD CONSTRAINT "workspace_invite_links_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invite_links" ADD CONSTRAINT "workspace_invite_links_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_role_permissions" ADD CONSTRAINT "workspace_role_permissions_workspaceRoleId_workspace_roles_id_fk" FOREIGN KEY ("workspaceRoleId") REFERENCES "public"."workspace_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_roles" ADD CONSTRAINT "workspace_roles_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_cardId_card_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_commentId_card_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."card_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_webhooks" ADD CONSTRAINT "workspace_webhooks_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_webhooks" ADD CONSTRAINT "workspace_webhooks_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "board_visibility_idx" ON "board" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "board_type_idx" ON "board" USING btree ("type");--> statement-breakpoint
CREATE INDEX "board_source_idx" ON "board" USING btree ("sourceBoardId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_slug_per_workspace" ON "board" USING btree ("workspaceId","slug") WHERE "board"."deletedAt" IS NULL;--> statement-breakpoint
CREATE INDEX "user_board_favorite_user_idx" ON "user_board_favorites" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_board_favorite_board_idx" ON "user_board_favorites" USING btree ("boardId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_member_permission" ON "workspace_member_permissions" USING btree ("workspaceMemberId","permission");--> statement-breakpoint
CREATE INDEX "permission_member_idx" ON "workspace_member_permissions" USING btree ("workspaceMemberId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_role_permission" ON "workspace_role_permissions" USING btree ("workspaceRoleId","permission");--> statement-breakpoint
CREATE INDEX "role_permissions_role_idx" ON "workspace_role_permissions" USING btree ("workspaceRoleId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_role_per_workspace" ON "workspace_roles" USING btree ("workspaceId","name");--> statement-breakpoint
CREATE INDEX "workspace_roles_workspace_idx" ON "workspace_roles" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "notification_user_deleted_idx" ON "notification" USING btree ("userId","deletedAt");--> statement-breakpoint
CREATE INDEX "notification_user_read_deleted_idx" ON "notification" USING btree ("userId","readAt","deletedAt");--> statement-breakpoint
CREATE INDEX "notification_user_type_card_idx" ON "notification" USING btree ("userId","type","cardId");--> statement-breakpoint
CREATE INDEX "notification_user_type_workspace_idx" ON "notification" USING btree ("userId","type","workspaceId");--> statement-breakpoint
CREATE INDEX "notification_user_created_idx" ON "notification" USING btree ("userId","createdAt");--> statement-breakpoint
CREATE INDEX "workspace_webhooks_workspace_idx" ON "workspace_webhooks" USING btree ("workspaceId");