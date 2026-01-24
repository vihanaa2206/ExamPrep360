from models.user import users_db

def get_all_users():
    """
    Returns list of all users (ADMIN action)
    """
    return users_db


def get_user_by_id(user_id):
    """
    Returns a single user by ID
    """
    for user in users_db:
        if user.id == user_id:
            return user
    return None
