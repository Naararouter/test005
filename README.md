# Sticky Notes Application

### Common
Spent time: 4h (4 base feature + 2 bonuses);

**Note**: This time is not including the next points (hope, it's fair, including - 6h):
 * learning of native D&D cause I don't have a good experience with it before;
 * preparation of this doc;

Additional time, for completing all tasks: +2h; 

### **List of features**
 ✅	&nbsp;- implemented;
 ❌	&nbsp;- not implemented;
 ⏱ &nbsp;- in additional time;
 
 Base (4/4):
 1. ✅	&nbsp;Create a new note of the specified size at the specified position.
 2. ✅	&nbsp;Change note size by dragging.
 3. ✅	&nbsp;Move a note by dragging.
 4. ✅	&nbsp;Remove a note by dragging it over a predefined "trash" zone.
 
 Bonuses (5/5): 
 1. ✅	&nbsp;Entering/editing note text. 
 2. ✅&nbsp;⏱	&nbsp;Moving notes to front (in case of overlapping notes). 
 3. ✅	&nbsp;Saving notes to local storage (restoring them on page load). 
 4. ✅&nbsp;⏱	&nbsp;Different note colors. 
 5. ✅&nbsp;⏱	&nbsp;Saving notes to REST API. Note: you're not required to implement the API, you can mock it, but the mocks should be asynchronous. 


### **Architecture**
* ⚡&nbsp;Pure-JS and zero-dependency solution for modern browsers;
* There are three main part of application: 
    * `Note`-class for individual sticky note management;
    * `Store`-class for managing of `Note`-groups; 
    * `trashZoneActivate` function, it doesn't have own class because it's pretty simple and small;
* We should use `Store` for managing of our application state, not `Note` class directly.
* I have tried to make a code is speaking for itself, but sometimes you'll find a some, maybe, important comments;
* Also, I've used a some unobvious techniques for goal achievment (as simple as I can, and there weren't restrictions in requirements about this) such as: 
    * resizing via textarea native resize
    * static trash zone (otherwise, we should make a lot of overhead logic to know element interesection and etc., and there was a cause because of that I made a `mouse-event driven D&D` instead of using of `HTML5 D&D API`
* Promise-wrap for localStorage operations to REST API Mocking;

P.s.: ⚠️&nbsp; Default timer for async operation is random value from 0 to 10 sec.

### **How to run**
Make sure you are in project folder via command line, and run the next commands:
1. `yarn`
2. `yarn build`
3. `yarn serve`
4. Go to `http://localhost:5000` in your browser (5000 - it's default port, you should check your exact port in the console output after previous step was done)

### **Known issues**
1. Don't support touch-event;
2. Don't support live-resizing;
3. Sources should be minimized for production mode;

Points below because of additional tasks in over-time (hurried):
* I'd prefer to move logic of `loader` and `notify` to JS part from static html (but, in any case, it's working fine for current conditionals);
