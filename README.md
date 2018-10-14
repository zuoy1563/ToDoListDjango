# ToDoListDjango

ToDoListDjango is based on Django and it allow users easily create their own to-do lists. It has the following features:

  - CRUD functions for Item entity
  - Marking Item as completed
  - Filtering items according to their status (completed or not)
  - Single page application
  - Rest framework

# Technical Stack
  - Python 3.6
  - Django 2.1.2 with its build-in sqlite database
  - jQuery 3.3.1 and jQuery DataTables 1.10.19
  - HTML 5
  - CSS 3
  - Bootsrtap 4.1.3

# Set-up

  - Install Python 3.6
  - Install Django with command: `pip3 install Django`
  - Open the project in an IDE (PyCharm recommended here)
  - Set up database:
       - Run command: `python3 manage.py makemigrations`
       - Run command: `python3 manage.py migrate`
  - Select the name of this Django project in the dropdown list on the top-right of PyCharm window
  - Open dropdown list again and click "Edit Configurations"
  - Check the port that the server is running on, normally it is 8000
  - Click the green arrow to start the application
  - Open the browser and enter `127.0.0.1:8000`
  - Enjoy!


# APIs
| URL | Method | Response (JSON format) |
| ------ | ------ | ------ |
| /api/v1/items | GET | Get all items in the database |
| /api/v1/items | POST | Create a new item |
| /api/v1/items/:id | PUT | Edit an existing item |
| /api/v1/items/:id | DELETE | Delete an item |

# Tips
  - Title length should be 1-50 characters
  - Description length should be 1-500 characters
  - While inputing dates, please follow the parttern "yyyy-MM-dd" (will improve later!)
  - Start date should be ealier than the end date (of course)
  - Start date should be today or later
  - Since the end date is the estimated date, it is allowed that items is not completed even after the end date. In this circumstance, the font color of the end date will turn red and be appended with "(Over Due)"
  - All items, completed items or not complted items can be shown respectively according to user selection
  - The background color of the "status" cells of completed items will turn green, otherwise it will be red

# To Be Improved
  - Allow users to mark completed items back to not completed
  - UI enhancement (e.g. calendar)
  - Ask for confirmation
  - Write test cases

# Comments
This was my first time to write Django project so that I had been confused during the whole development process. Too many things I have to learn, so that I did should thank Mr. Google, who helped me alot. Django was completely new to me, but fortunately, I finally worked this project out although it still can be improved (and I will!).

# Reference List
   - [Another Django rest CRUD project on Github](https://github.com/JuanBenitez97/django-rest-framework-crud)
   - [W3Schools](https://www.w3schools.com/)
   - [Django documentation](https://docs.djangoproject.com/en/2.1/)
   - [DataTables documentation](https://datatables.net/)
   - [jQuery documentation](https://api.jquery.com/)

