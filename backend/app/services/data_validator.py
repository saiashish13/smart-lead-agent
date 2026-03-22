def validate_lead(lead):
    required = ["name", "email"]
    missing = [f for f in required if f not in lead]
    return {
        "valid": len(missing) == 0,
        "missing_fields": missing
    }
