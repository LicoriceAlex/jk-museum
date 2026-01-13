from backend.app.db.models.organization import OrgStatusEnum

organization_statuses_map = {
    OrgStatusEnum.approved: [],
    OrgStatusEnum.draft: [OrgStatusEnum.on_moderation],
    OrgStatusEnum.on_moderation: [OrgStatusEnum.approved, OrgStatusEnum.needs_revision],
    OrgStatusEnum.needs_revision: [OrgStatusEnum.on_moderation],
}
