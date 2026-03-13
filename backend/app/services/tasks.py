from celery import Celery

celery = Celery(
    "smart_lead",
    broker="redis://localhost:6379/0"
)

@celery.task
def async_enrich(lead):
    lead["async_enriched"] = True
    return lead
