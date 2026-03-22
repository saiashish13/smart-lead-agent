def score_lead(lead):
    score = 0
    if lead.get("email"):
        score += 40
    if lead.get("company"):
        score += 30
    return score
