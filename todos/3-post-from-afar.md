# Post updates as a service

--------

Right now, in order to post this update, I need to have a copy of the repo,
write a new post locally, and then scp it up to my server. This is pretty
simple, but not terribly easy. It means that wherever I am, I need to have time
to (a) download the repo, (b) figure out how to get scp on the machine if its
not there already, (d) have access to the terminal and ideally bash, and
finally (e) install node.js. I don't particularly look forward to this
experience at an internet cafe or on the hotel computer, so I think it'd be a
good thing to do to add what is essentially a pastebin, preferably secured by
https (so that not just anybody can post to my blog), or, since the data is
going to be public anyway, perhaps just [digest
authentication](http://www.ietf.org/rfc/rfc2617.txt).

I could take advantage of the fact that I'm already using nginx, and just run
this remote posting stuff as service completely separate from the web page you
are looking at now. I could build in edit and review features. Is it crazy to
have one service for display and one service for CRUD? Probably, but who cares?
It's small beans anyway.
