jQuery(document).ready( function() {

   var chat = Chat();
   chat.init()
   chat.setProfile(profile)

   initializePubNub();

})
