import { getBookingForReschedule } from "@calcom/features/bookings/lib/get-booking";
import getAllUserBookings from "@calcom/features/bookings/lib/getAllUserBookings";
import { getBookingFieldsWithSystemFields } from "@calcom/features/bookings/lib/getBookingFields";
import getBookingInfo from "@calcom/features/bookings/lib/getBookingInfo";
import handleCancelBooking from "@calcom/features/bookings/lib/handleCancelBooking";
import handleMarkNoShow from "@calcom/features/handleMarkNoShow";
import { getTranslation } from "@calcom/i18n/server";
import { symmetricDecrypt, symmetricEncrypt } from "@calcom/lib/crypto";
import { slugify } from "@calcom/lib/slugify";
import prisma from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import type {
  CreationSource as CreationSourceEnum,
  MembershipRole as MembershipRoleEnum,
} from "@calcom/prisma/enums";
import { credentialForCalendarServiceSelect } from "@calcom/prisma/selects/credential";
import { paymentDataSelect } from "@calcom/prisma/selects/payment";
import { randomUUID } from "node:crypto";

export { slugify } from "@calcom/lib/slugify";
export { slugifyLenient } from "@calcom/lib/slugify-lenient";
export { getBookingForReschedule };

export { getWebhookProducer } from "@calcom/features/di/webhooks/containers/webhook";
export { getUsernameList } from "@calcom/features/eventtypes/lib/defaultEvents";
export {
  DEFAULT_WEBHOOK_VERSION,
  WebhookVersion,
} from "@calcom/features/webhooks/lib/interface/IWebhookRepository";
export type { IWebhookProducerService } from "@calcom/features/webhooks/lib/interface/WebhookProducerService";
export {
  AttributeType,
  CreationSource,
  MembershipRole,
  PeriodType,
  SchedulingType,
  TimeUnit,
  WebhookTriggerEvents,
} from "@calcom/prisma/enums";
export type { CalendarEvent, EventBusyDate } from "@calcom/types/Calendar";

export { handleMarkNoShow };

export type {
  BookingCreateBody,
  BookingResponse,
} from "@calcom/features/bookings/types";
export type { ConnectedCalendar } from "@calcom/features/calendars/lib/CalendarManager";
export {
  getBusyCalendarTimes,
  updateEvent,
} from "@calcom/features/calendars/lib/CalendarManager";
export type { ConnectedDestinationCalendars } from "@calcom/features/calendars/lib/getConnectedDestinationCalendars";
export { getConnectedDestinationCalendarsAndEnsureDefaultsInDb } from "@calcom/features/calendars/lib/getConnectedDestinationCalendars";
export type { CityTimezones } from "@calcom/features/cityTimezones/cityTimezonesHandler";
export { cityTimezonesHandler } from "@calcom/features/cityTimezones/cityTimezonesHandler";
export { ENABLE_ASYNC_TASKER, MINUTES_TO_BOOK } from "@calcom/lib/constants";
export { TRPCError } from "@trpc/server";

export { getAllUserBookings };
export { getBookingInfo };
export { handleCancelBooking };

export { dynamicEvent } from "@calcom/features/eventtypes/lib/defaultEvents";
export { parseBookingLimit } from "@calcom/lib/intervalLimits/isBookingLimits";
export { parseRecurringEvent } from "@calcom/lib/isRecurringEvent";
export {
  bookingMetadataSchema,
  teamMetadataSchema,
  userMetadata,
} from "@calcom/prisma/zod-utils";

export { symmetricEncrypt, symmetricDecrypt };

export { getTranslation };

export { validateCustomEventName } from "@calcom/features/eventtypes/lib/eventNaming";

export type TeamQuery = Prisma.TeamGetPayload<{
  select: {
    id: true;
    credentials: {
      select: typeof import("@calcom/prisma/selects/credential").credentialForCalendarServiceSelect;
    };
    name: true;
    logoUrl: true;
    members: {
      select: {
        role: true;
      };
    };
  };
}>;

export { credentialForCalendarServiceSelect };
export { paymentDataSelect };
export { confirmHandler as confirmBookingHandler } from "@calcom/trpc/server/routers/viewer/bookings/confirm.handler";
export { getBookingFieldsWithSystemFields };

export { checkAdminOrOwner } from "@calcom/features/auth/lib/checkAdminOrOwner";
export { sendLocationChangeEmailsAndSMS } from "@calcom/emails/email-manager";
export { verifyCodeUnAuthenticated } from "@calcom/features/auth/lib/verifyCodeUnAuthenticated";
export { sendEmailVerificationByCode } from "@calcom/features/auth/lib/verifyEmail";
export { getCalendarLinks } from "@calcom/features/bookings/lib/getCalendarLinks";
export { BookingReferenceRepository } from "@calcom/features/bookingReference/repositories/BookingReferenceRepository";
export { BookingAccessService } from "@calcom/features/bookings/services/BookingAccessService";
export { CredentialRepository } from "@calcom/features/credentials/repositories/CredentialRepository";
export type { OrgMembershipLookup } from "@calcom/features/di/modules/OrgMembershipLookup";
export type { OAuth2Tokens } from "@calcom/features/oauth/services/OAuthService";
export { OAuthService } from "@calcom/features/oauth/services/OAuthService";
export { generateSecret } from "@calcom/features/oauth/utils/generateSecret";
export { ProfileRepository } from "@calcom/features/profile/repositories/ProfileRepository";
export { SelectedCalendarRepository } from "@calcom/features/selectedCalendar/repositories/SelectedCalendarRepository";
export type { Tasker } from "@calcom/features/tasker/tasker";
export { getTasker } from "@calcom/features/tasker/tasker-factory";
export { buildCalEventFromBooking } from "@calcom/lib/buildCalEventFromBooking";
export { getVideoCallUrlFromCalEvent } from "@calcom/lib/CalEventParser";
export { verifyCodeChallenge } from "@calcom/lib/pkce";
export { encryptServiceAccountKey } from "@calcom/lib/server/serviceAccountKey";
export { validateUrlForSSRFSync } from "@calcom/lib/ssrfProtection";
export type { TraceContext } from "@calcom/lib/tracing";
export { distributedTracing } from "@calcom/lib/tracing/factory";
export {
  type BookingWithUserAndEventDetails,
  bookingWithUserAndEventDetailsSelect,
} from "@calcom/prisma/selects/booking";
export { checkEmailVerificationRequired } from "@calcom/trpc/server/routers/publicViewer/checkIfUserEmailVerificationRequired.handler";
export type { CredentialForCalendarService } from "@calcom/types/Credential";

// === Stubs for deleted EE features still imported by API v2 ===

// Round-robin reassignment removed (EE feature) — stubs for API v2
export async function roundRobinManualReassignment(_args: {
  bookingId: number;
  newUserId: number;
  orgId?: number | null;
  reassignReason?: string;
  reassignedById?: number;
  emailsEnabled?: boolean;
  platformClientParams?: unknown;
  actionSource?: string;
  reassignedByUuid?: string;
}): Promise<void> {
  // No-op in community edition
}

export async function roundRobinReassignment(_args: {
  bookingId: number;
  orgId?: number | null;
  emailsEnabled?: boolean;
  platformClientParams?: unknown;
  reassignedById?: number;
  actionSource?: string;
  reassignedByUuid?: string;
}): Promise<void> {
  // No-op in community edition
}

// createApiKeyHandler removed (EE feature) — stub for API v2
export async function createApiKeyHandler(_args: {
  ctx: { user: { id: number } };
  input: {
    note?: string | null;
    neverExpires?: boolean;
    expiresAt?: Date | null;
    teamId?: number;
  };
}): Promise<string> {
  throw new Error("API key creation is not available in community edition");
}

// getClientSecretFromPayment removed (EE feature) — stub for API v2
export function getClientSecretFromPayment(payment: { data: Record<string, unknown> }): string | null {
  const data = payment.data;
  if (data && typeof data === "object" && "client_secret" in data) {
    return data.client_secret as string;
  }
  return null;
}

// verifyCodeAuthenticated removed (EE feature) — stub for API v2
export async function verifyCodeAuthenticated(_args: {
  user: { id: number; email?: string; [key: string]: unknown };
  email: string;
  code: string;
}): Promise<boolean> {
  return false;
}

// createNewUsersConnectToOrgIfExists: minimal community implementation (the EE original was
// removed with the ee/ tree). Covers the API v2 managed-users path only: creates the user
// inside the org with an accepted membership and an org profile. Email invitation flows,
// child-team joins and auto-accept-by-domain from the EE version are NOT implemented.
export async function createNewUsersConnectToOrgIfExists(args: {
  invitations: { usernameOrEmail: string; role: string }[];
  creationSource?: string;
  teamId: number;
  isOrg: boolean;
  parentId: number | null;
  autoAcceptEmailDomain: string;
  orgConnectInfoByUsernameOrEmail: Record<string, { orgId: number; autoAccept: boolean }>;
  isPlatformManaged?: boolean;
  timeFormat?: number;
  weekStart?: string;
  timeZone?: string;
  language?: string;
}): Promise<{ id: number; email: string; username: string }[]> {
  const {
    invitations,
    teamId,
    orgConnectInfoByUsernameOrEmail,
    isPlatformManaged,
    timeFormat,
    weekStart,
    timeZone,
    language,
    creationSource,
  } = args;

  const created: { id: number; email: string; username: string }[] = [];
  for (const invitation of invitations) {
    const email = invitation.usernameOrEmail.toLowerCase();
    const username = slugify(email.split("@")[0]);
    const autoAccept = orgConnectInfoByUsernameOrEmail[invitation.usernameOrEmail]?.autoAccept ?? true;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        organizationId: teamId,
        isPlatformManaged: isPlatformManaged ?? false,
        invitedTo: teamId,
        ...(timeZone ? { timeZone } : {}),
        ...(weekStart ? { weekStart } : {}),
        ...(timeFormat !== undefined ? { timeFormat } : {}),
        ...(language ? { locale: language } : {}),
        verified: true,
        emailVerified: new Date(),
        completedOnboarding: true,
        ...(creationSource ? { creationSource: creationSource as CreationSourceEnum } : {}),
        teams: {
          create: {
            team: { connect: { id: teamId } },
            role: invitation.role as MembershipRoleEnum,
            accepted: autoAccept,
          },
        },
        profiles: {
          create: {
            uid: randomUUID(),
            organization: { connect: { id: teamId } },
            username,
          },
        },
      },
    });
    created.push({ id: user.id, email: user.email, username: user.username ?? username });
  }
  return created;
}

// sendVerificationCode removed (EE feature) — stub for API v2
export async function sendVerificationCode(_phoneNumber: string): Promise<void> {
  throw new Error("Phone verification is not available in community edition");
}

// verifyPhoneNumber removed (EE feature) — stub for API v2
export async function verifyPhoneNumber(
  _phoneNumber: string,
  _code: string,
  _userId: number,
  _teamId?: number
): Promise<boolean> {
  throw new Error("Phone verification is not available in community edition");
}
