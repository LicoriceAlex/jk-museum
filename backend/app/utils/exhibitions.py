from backend.app.db.models.exhibition import ExhibitionStatusEnum

exhibition_status_map = {
    ExhibitionStatusEnum.draft: [
        ExhibitionStatusEnum.on_mo_review,
    ],
    ExhibitionStatusEnum.on_mo_review: [
        ExhibitionStatusEnum.on_mo_revision,          # директор МО вернул на доработку
        ExhibitionStatusEnum.ready_for_platform,      # директор МО одобрил
    ],
    ExhibitionStatusEnum.on_mo_revision: [
        ExhibitionStatusEnum.on_mo_review,            # после доработки снова на проверку МО
    ],
    ExhibitionStatusEnum.ready_for_platform: [
        ExhibitionStatusEnum.awaiting_platform_review,  # отправка на платформу
    ],
    ExhibitionStatusEnum.awaiting_platform_review: [
        ExhibitionStatusEnum.published,                     # одобрено и опубликовано
        ExhibitionStatusEnum.needs_revision_after_moderation,  # отправлено на доработку
    ],
    ExhibitionStatusEnum.needs_revision_after_moderation: [
        ExhibitionStatusEnum.awaiting_platform_review,  # после внутреннего цикла МО снова на модерацию платформы
    ],
    ExhibitionStatusEnum.published: [
        ExhibitionStatusEnum.published_changes_pending_review,  # МО отправил изменения на модерацию
    ],
    ExhibitionStatusEnum.published_changes_pending_review: [
        ExhibitionStatusEnum.published,                     # администратор одобрил изменения → изменения применены
        ExhibitionStatusEnum.needs_revision_after_moderation,  # администратор отправил изменения на доработку
    ],
}
