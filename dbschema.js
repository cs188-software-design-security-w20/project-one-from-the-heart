let db = {
  tickets = [
    {
      //TENANT-generated
      "description": "bed bugs",
      "special_insns": "come at 5pm",
      //SYSTEM-generated
      "submit_time": "{system.submit_time}",
      "priority": "{system.priority}",
      "tenant_name": "{user.name}",
      "address": "{user.address}"
    }
  ],
  users = [
    {
      //USER CANNOT CHANGE after SIGNUP
      "first_name": "Clark"
      "last_name": "Minor"
      "address": "1234 Drury Lane",
      "user-type": "admin" | "worker" | "tenant"

      //USER CAN CHANGE while LOGGED IN
      "email": "user@email.com",
      "password": "12345",
      "confirm_password": "12345",


    }
  ]

}
