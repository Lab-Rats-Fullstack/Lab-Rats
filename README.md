# Lab-Rats - Group Capstone project for the 2309-ftb-et-web-pt cohort of Fullstack Academy.
Culinary Chronicle is a PERN stack recipe review website. It allows users to register and sign in to an account, view, comment, and review recipes. The front end is hosted on Netlify, images are hosted on Cloudinary, and the back end is hosted on Render.
Due to the nature of the free tier on Render, loading times when the website has been inactive can be long. If loading takes longer than a minute, refreshing the page should ensure the server is up and running properly.

### Authored by:
   
[Lisa Barry](https://www.linkedin.com/in/lisa-barry/)

[Jared May](https://www.linkedin.com/in/jaredmaycoding/)

[Allison Meadors](https://www.linkedin.com/in/allison-meadors/)  

[Larry Reaux](https://www.linkedin.com/in/ljreaux/)

# Current Functionality
Main page:
- contains tabs of the recipe category tags for quick navigation
- features a random recipe each time Main page is accessed so that more recipes are seen

Recipes page:
- contains all recipes in RecipePagination for easier viewing
- has a search bar that will search for recipes via Title and category tags
- has a category tag filter for faster searches

Login page:
- contains both User Login and User Registration
- login requires:
- username
- password
- submit button
- registration requires:
    - username
    - email
    - name
    - password
    - confirm password
    - submit button
        - new password must match itself on a confirm password section or submit button will disable
        - upon successful login/registration an Alert informs the user they are logged in and user is redirected to their account page

Account page:
- contains a section for user personal information
    - profile image
    - username
    - email
    - name
- contains an update button that is a form
- update form contains:
    - Image preview for updating profile image
    - username- prefilled in with current username
    - email- prefilled in with current email address
    - name- prefilled in with current name
    - password
        - old password is not provided for security
        - if no new password is added, password will not be updated
    - confirm password
    - submit button
        - new password must match itself on a confirm password section or submit button will disable
    - cancel button
- contains a section for user content information
    - these sections are nested routes
    - recipes
        - if user is Admin, they will also see a create Recipe button
            - button navigaes to New Recipe page
        - if no recipes, a message will state no current content
        - if there are recipes, each will display in the format of the recipe card minus the username
    - reviews
        - if no reviews, a message will state no current content
        - if there are reviews, each will display in the format of the review card minus the username
    - comments
        - if no comments, a message will state no current content
        - if there are comments, each will display in the format of the comment card minus the username

User Profile page:
- This is a profile page for the view of OTHER user profiles

Viewer/User sees:
    - contains a section for user public information
        - profile image
        - username
    - contains a section for user content information
        - recipes
        - reviews
        - comments
- contains a section for user content information
    - these sections are nested routes
    - recipes
        - if no recipes, a message will state no current content
        - if there are recipes, each will display in the format of the recipe card minus the username
    - reviews
        - if no reviews, a message will state no current content
        - if there are reviews, each will display in the format of the review card minus the username
    - comments
        - if no comments, a message will state no current content
        - if there are comments, each will display in the format of the comment card minus the username

Admin additionally sees:
- contains a section for user personal information
    - profile image
    - username
    - email
    - name
    - admin status
        - either user or Admin
- contains an update button that is a form
- update form contains:
    - Image preview for updating profile image
    - username- prefilled in with current username
    - email- prefilled in with current email address
    - name- prefilled in with current name
    - admin status - true/false drop down selector
        - status is pre-set to user's current admin status
    - password
        - old password is not provided for security
        - if no new password is added, password will not be updated
    - confirm password
    - submit button
        - new password must match itself on a confirm password section or submit button will disable
    - cancel button

Recipe card:
- recipe Title
    - links to specific recipe
- recipe creator's username
    - links to specific user profile page
- uploaded image
- estimated time (est. time)
- up to 5 category tags
- current review score, or a message it has not yet been reviewed
- navigation button to see the specific recipe

Review card:
- review title
- review content
- recipe Title
    - links to specific recipe
- recipe creator's username
    - links to specific user profile page
- reviewer's rating of recipe
- navigation button to see the specific recipe

Comment card:
- comment content
- review title
- review creator's username
    - links to specific user profile page
- recipe Title
    - links to specific recipe
- recipe creator's username
    - links to specific user profile page
- navigation button to see the specific recipe

Viewers (anyone) accessing the website will be able to: 
- view all recipes
- search through the recipes via titles and category tags
- view recipes by user via the user's profile page
- view reviews on recipes
- view comments on recipes
- be able to register a new account to become a user

Users accessing the website will be able to:
- have all the functionality of all viewers
- be able to leave a review on each recipe
- be able to edit or delete their review on each recipe
- be able to leave comments on reviews
- be able to edit or delete their comments on reviews
- be ale to update their own user information, this includes:
    - uploading a profile picture
    - updating their username
    - updating their email
    - updating their name
    - updating their password
    
Admin accessing the website will be able to:
- have all the functionality of both viewers and users
- be able to create, edit, and delete recipes
- be able to view all users
- be able to view all user information except passwords
- be able to see if all users are User or Admin status
- be able to update other user's status to make them Admin, or remove those permissions
- be able to see a list of all recipes that contain reviews
- be able to see all the category tags

# Potential Functionality
Users in the future may:
- gain the ability to create, edit, delete their own recipes

Admin in the future may:
- gain the ability to create new category tags
- gain the ability to edit category tags

Tags on recipe cards will be links similar to the tabs on main page.

The User Recipes section in the Profile/Account page may gain category tag tabs based on the tags used in their specific recipes.
