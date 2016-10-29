var ConsoleApp = require('../consoleapp.js');
var wrap = require('wordwrap')(80);

class CrewManifest extends ConsoleApp {
    constructor(db) {
        super(db);
        this.db = db;
        this.state = 'list';
    }
    isEnabled() {
        return true;
    }
    getInputExpr() {
        return '2';
    }
    getName() {
        return 'Crew Manifest';
    }
    begin() {
        super.begin();
        try {
            this.crew = this.db.getOptsFromFile('crew', true);
            this.listMembers();
        }
        catch (e) {
            this.output('Corrupt datastack - aborting');
            this.end();
        }
    }
    processCommand(cmd) {
        try {
            this.crew = this.db.getOptsFromFile('crew', true);
            switch (this.state) {
                case 'list':
                    var cmdNum = parseInt(cmd, 10) - 1;
                    if (this.crew[cmdNum]) {
                        this.showBio(this.crew[cmdNum]);
                        this.state = 'person';
                    }
                    if (cmdNum === this.crew.length) {
                        this.end();
                    }
                break;
                case 'person':
                    this.state = 'list';
                    this.listMembers();
            }
        }
        catch (e) {
            this.output('Corrupt datastack - aborting');
            this.end();
        }
    }
    listMembers() {
        let r = "The manifest lists the following entities under classification 'crew':";
        this.crew.forEach((record, index) => {
            r += "\n" + (index+1) +". " + record.name + ", " + record.role + 
                 " <em class='"+record.status.toLowerCase()+"'>(" + record.status + ")</em>";
        });
        r += "\n" + (this.crew.length + 1) + ". Exit";
        this.output(r);
    }
    showBio(person) {
        let r = "<div class='bio'>";
        if (person.image) {
            r += '<img class="bio-image" onload="window.scrollTo(0, document.body.scrollHeight);" src="/images/crew/' + person.image + '">';
        }
        r += "Name: <strong>" + person.name.toUpperCase() + "</strong>\n";
        r += "Role: " + person.role + "\n";
        r += "Stat: <em class='"+person.status.toLowerCase()+"'>" + person.status.toUpperCase() + "</em>\n";
        r += "-------------\n";
        r += person.bio;
        r += "\n-------------</div>";
        r += "\nAny command to return";
        this.output(r);
    }
}

module.exports = CrewManifest;