export class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;

        this.smileX = 300;
        this.smileY = 350;

        this.leftEyeX = 200;
        this.leftEyeY = 300;

        this.rightEyeX = 400;
        this.rightEyeY = 300;

        this.leftBrowX = 200;
        this.leftBrowY = 275;

        this.rightBrowX = 400;
        this.rightBrowY = 275;

        this.leftArmX = 160;
        this.leftArmY = 400;

        this.rightArmX = 440;
        this.rightArmY = 400;

        this.leftLegX = 220;
        this.leftLegY = 500;

        this.rightLegX = 380;
        this.rightLegY = 500;

        this.smile = true;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_yellowA.png");
        my.sprite.mouth = this.add.sprite(this.smileX, this.smileY, "monsterParts", "mouth_closed_happy.png");
        my.sprite.leftEye = this.add.sprite(this.leftEyeX, this.leftEyeY, "monsterParts", "eye_blue.png");
        my.sprite.rightEye = this.add.sprite(this.rightEyeX, this.rightEyeY, "monsterParts", "eye_blue.png");
        my.sprite.leftBrow = this.add.sprite(this.leftBrowX, this.leftBrowY, "monsterParts", "eyebrowC.png");
        my.sprite.rightBrow = this.add.sprite(this.rightBrowX, this.rightBrowY, "monsterParts", "eyebrowC.png");
        my.sprite.leftBrow.flipX = true;
        my.sprite.leftArm = this.add.sprite(this.leftArmX, this.leftArmY, "monsterParts", "arm_yellowB.png");
        my.sprite.leftArm.flipX = true;
        my.sprite.leftArm.rotation = 120;
        my.sprite.rightArm = this.add.sprite(this.rightArmX, this.rightArmY, "monsterParts", "arm_yellowB.png");
        my.sprite.rightArm.rotation = -120;

        my.sprite.leftLeg = this.add.sprite(this.leftLegX, this.leftLegY, "monsterParts", "leg_yellowA.png");
        my.sprite.leftLeg.flipX = true;
        my.sprite.rightLeg = this.add.sprite(this.rightLegX, this.rightLegY, "monsterParts", "leg_yellowA.png");

        // Event input: dimple smile
        /*fKey.on('down', (key, event) => {
            my.sprite.mouth.setTexture("monsterParts", "mouth_closed_fangs.png");
        });

        sKey.on('down', (key, event) => {
            my.sprite.mouth.setTexture("monsterParts", "mouth_closed_happy.png");
        })*/
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        /*if (this.dKey.isDown) {
            for (let i in my.sprite) {
                my.sprite[i].x += 1;
            }
        }

        
        if (this.aKey.isDown) {
            for (let i in my.sprite) {
                my.sprite[i].x -= 1;
            }
        }*/
    }

    zoomMap(zoomLevel) {
        console.log("zoom tool called");
        const clampedZoom = Phaser.Math.Clamp(zoomLevel, 0, 10);
        this.gameScale = clampedZoom; // Store the zoom level
        this.cameras.main.setZoom(clampedZoom);
        return `Game is now zoomed to level ${clampedZoom}`;
    }

    switchFace() {
        let my = this.my;
        if (this.smile) {
            my.sprite.mouth.setTexture("monsterParts", "mouth_closed_fangs.png");
        } else {
            my.sprite.mouth.setTexture("monsterParts", "mouth_closed_happy.png");
        }
        this.smile = !this.smile;

        return `Face is switched`;
    }

}