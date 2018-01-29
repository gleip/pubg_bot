//
//  Programmer Unknown's BattleGround
//  Sample Algorithm
//
//  The MIT License (MIT)
//
//  Copyright (c) 2018 AppCraft LLC, http://appcraft.pro/pubg/
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//
//  Please read documentation at http://appcraft.pro/pubg/docs/

/**
 * -----------------------
 *     Global consts
 * -----------------------
 * 
 * // Contains max lives for each creature's level
 * creatureMaxLives = [100.0, 150.0, 250.0]
 * 
 * // Contains max energy for each creature's level
 * creatureMaxEnergy = [100.0, 150.0, 250.0]
 * 
 * // Max amount of bullet each creature can carry
 * creatureMaxBullets = [3, 4, 5]
 * 
 * // Possible actions
 * actions = { 
 *      none:   0,    // do nothing, no energy required. No params needed.
 *      move:   1,    // move in specified direction, in radians:
 *                       { do: actions.move, params: { angle: 1.5 } }
 *                       Movement costs energy.
 *      rotate: 2,    // rotate cw or ccw:
 *                       { do: actions.rotate, params: { clockwise: true } }
 *                       Doesn't cost energy.
 *      turn:   3,    // turn to specified angle:
 *                       { do: actions.turn, params: { angle: 1.5 } }
 *                       Doesn't cost energy.
 *      shoot:  4,    // shoot. Costs energy, no params needed.
 *                       { do: actions.shoot }
 *      jump:   5,    // jump in specified direction, in radians:
 *                       { do: actions.jump, params: { angle: 1.5 } }
 *      eat:    6,    // eat a bullet, no params needed:
 *                       { do: actions.eat }
 *                       Costs a lot of energy.
 *      spell:  7     // make some street magic:
 *                       { do: actions.spell }
 *                       Costs a lot of energy.
 *                       Some spells require additional params, 
 *                       please see http://appcraft.pro/pubg/docs/en/creature-actions.html
 *                       for more details.
 * }
 * 
 * // Possible creature's kinds
 * kinds = { rhino: 0, bear: 1, moose: 2, bull: 3, runchip: 4, miner: 5, sprayer: 6, splitpus: 7 }
 * 
 * // Battleground dimensions
 * ground = { width: 100, height: 100 }
 * 
 * // Hurt per bullet hit
 * bulletDamage = 10
 * 
 * // Energy costs
 * moveEnergyCost = 1
 * shotEnergyCost = 10
 * jumpEnergyCost = 30
 * eatBulletEnergyCost = 60
 * 
 * // How much lives each eaten bullet gives
 * livesPerEatenBullet = 40
 * 
 * 
 * -----------------------
 *        Helpers
 * -----------------------
 * 
 * // Returns distance between two objects. Each of them must has {postision} property with {x} and {y} in it/
 * distanceBetween(obj1, obj2)
 * 
 * // Distance between two points.
 * distanceBetweenPoints(pt1, pt2)
 * 
 * // Angle between two objects.
 * angleBetween(obj1, obj2)
 * 
 * // Angle between two points.
 * angleBetweenPoints(pt1, pt2)
 * 
 * // Returns normalized angle. E.g. (PI * 7) converts to (PI), (-PI) converts to (PI).
 * normalizeAngle(angle)
 * 
 * // Returns difference between angles. Angles are normilized automatically.
 * differenceBetweenAngles(ang1, ang2)
 * 
 * // Returns random integer numbers in specified range.
 * randomInt(min, max)
 * 
 * // Returns random angle in radians.
 * randomAngle()
 * 
 * // Check are objects visible to each other.
 * rayBetween(obj1, obj2)
 * 
 */

br_gleip = {
    
  /* Name of your awesome neuro-blockchain algorithm. 10 chars max. */
  name: "gleip",

  /** 
   * Kind of a creature. 
   * Possible variations are [rhino, bear, moose, bull, runchip, miner, sprayer, splitpus].
   */
  kind: kinds.rhino,

  /* 10 chars max, displayed with name of the algorithm on the leaderboard. */
  author: "gLeip",

  /** 
   * Describe what logic you implemented in this brain
   * so other users can understand your genius thoughts.
   * It's not used in the game directly, rather
   * leaderboards (http://appcraft.pro/pubg/docs/en/leaderboard.html) 
   * takes brain's description from this variable.
   * */
  description: "Super brain for kills",

  /**
   * Loop function called by runner.
   * 
   * @param self contains the sctucture with data of your creature:
   * 
   * { id: 0,             // Unique ID of an object
   *   kills: 0,          // kills counter
   *   deaths: 0,         // deaths counter
   *   iq: 10,            // current IQ of your brain in current match
   *   name: "Megabrain", // name of the creature
   *   author: "Author",  // author of the creature
   *   lives: 100,        // amount of lives. Get max using {creatureMaxLives[self.level]}
   *   bullets: 3,        // amount of bullets your creature has. Limit is {creatureMaxBullets[self.level]}
   *   energy: 100,       // amount of energy. Get max using {creatureMaxEnergy[self.level]} 
   *   level: 0,          // level of the creature. There're 3 levels in the game: 0, 1 and 2.  
   *   position: { x: 10, y: 10 },  // position on the map. Use {ground} struct to get it's dimensions 
   *   velocity: { x: 10, y: 10 },  // contains velocity vector of the creature's body  
   *   angle: 1.5,        // direction the creature looking in, in radians.
   *   speed: 5,          // speed of the body
   *   angularVelocity: 1,// use it to determine is the creature rotating or not
   *   poisoned: false,   // is the creature poisoned or not
   *   spelling: false    // is the creature spelling or not
   * };
   * 
   * @param enemies contains an array with all other creatures. Can be empty.
   * It doesn't contain your creature, i.e. there is no self struct in it.
   * All elements has the same data like in self struct.
   * 
   * @param bullets an array with all bullets on the ground. Bullet's data has the following structure:
   * 
   * { id: 0,                       // Unique ID of an object
   *   position: { x: 10, y: 10 },  // position on the map
   *   velocity: { x: 10, y: 10 },  // direction of bullet's movement
   *   speed: 5,                    // speed of the bullet
   *   dangerous: false             // true if the speed of the bullet is enough to hurt a creature 
   * };        
   * 
   * @param objects contains all obstacles on the map with the following sctructure:
   * 
   * { id: 0,                       // Unique ID of an object
   *   position: { x: 10, y: 10 },  // position on the map
   *   velocity: { x: 10, y: 10 },  // direction of object's movement
   *   speed: 5,                    // speed of the object
   *   bounds: { min: { x: 5, y: 5 }, max: { x: 15, y: 15 } } 
   *                                // AABB region of the object
   *                                // min contains left top corner
   *                                // max contains bottom right corner of the rect
   * };
   * 
   * @param events contains happened events in last loop tick. Can be empty.
   * Each event has the following structure:
   * 
   * { type: eventTypes.birth,  // Type of an event. The following types of events are possible:
   *                            // eventTypes = { wound: 0, murder: 1, death: 2, upgrade: 3, birth: 4, spell: 5 }
   *   payload: [ creature ]    // An array with 1 or 2 creature objects.
   *                            // If contains 2 creatures, the 1st one is the object and the 2nd one is the subject.
   *                            // Payload of [wound, murder] events contains 2 creatures: 
   *                            // the 1st creature is the victim and the 2nd creature is the attacker.
   *                            // Payload of [death, upgrade, birth, spell] events contains 1 creature object.
   * };
   * 
   * @returns a structure with desired action in the following format: 
   * 
   * { do: actions.move,  // desired action. See all variations in the globals consts section. 
   *   params: {          // key value params, not necessary for some actions
   *      angle: 1.5      // desired direction of movement in radians
   *   }
   * };
   * 
   */
  thinkAboutIt: function(self, enemies, bullets, objects, events) {
    const safeBullet = [];
    const dangerousBullet = [];
    const enemysRange = [];
    const objectsRange = [];
    const center = { x: ground.width / 2, y: ground.height / 2 };

    bullets.forEach(bullet => {
      const dist = distanceBetween(bullet, self);
        if (bullet.dangerous) {
          dangerousBullet.push({...bullet, dist});
        }
        safeBullet.push({...bullet, dist});
    });

    objects.forEach((object) => {
      const dist = distanceBetween(self, object);
      objectsRange.push({...object, dist});
    });

    enemies.forEach((enemy) => {
      const dist = distanceBetween(enemy, self);
      enemysRange.push({...enemy, dist});
    });

    dangerousBullet.sort((a, b) => a.dist > b.dist ? 1 : -1);
    safeBullet.sort((a, b) => a.dist > b.dist ? 1 : -1);
    objectsRange.sort((a, b) => a.dist > b.dist ? 1 : -1);
    enemysRange.sort((a, b) => a.dist + a.lives > b.dist + b.lives ? 1 : -1);

    if (dangerousBullet.length >= 1) {
      if (dangerousBullet[0].dist < 200) {
        const danger = dangerousBullet[0];
        const bulletAngle = Math.atan2(danger.velocity.y, danger.velocity.x);
        const collisionAngle = angleBetween(danger, self);
        const backlash = Math.PI / 25.0;
        const diff = Math.abs(differenceBetweenAngles(bulletAngle, collisionAngle));
        const needDodge = diff < backlash;
        if (needDodge && self.energy >= jumpEnergyCost) {
          return { do: actions.jump, params: { angle: bulletAngle + Math.PI / 2.0 } };
        } else {
          return { do: actions.move, params: { angle: bulletAngle + Math.PI / 2.0 } };
        }
      }
    }

    if (self.lives < creatureMaxLives[self.level] * 0.20) {
      if (self.bullets >= 1) {
        if (self.energy >= eatBulletEnergyCost) {
          console.log('eat!');
          return { do: actions.eat };
        } else {
          return { do: actions.none };
        }
      }
    }

    // if (self.lives < creatureMaxLives[self.level] * 0.35) {
    //   if (safeBullet.length > 1 && self.bullet < creatureMaxBullets[self.level]) {
    //     const dist = distanceBetween(safeBullet[0], self);
    //     const angle = angleBetween(self, safeBullet[0]);
    //     if (dist < self.energy) {
    //       return { do: actions.move, params: { angle: angle } };
    //     }
    //   }
    // }


    if (self.energy < creatureMaxEnergy[self.level] * 0.15) {
      if (objectsRange.length > 1) {
        const dist = distanceBetween(objectsRange[0], self);
        const angle = angleBetween(self, objectsRange[0]);
        if (10 < dist < 50) {
          return { do: actions.move, params: { angle: angle } };
        }
        return { do: actions.none };
      }
    }

    if (self.bullets === 0) {
      if (safeBullet.length > 1) {
        const dist = distanceBetween(safeBullet[0], self);
        const angle = angleBetween(self, safeBullet[0]);
        return { do: actions.move, params: { angle: angle } };
      } else {
        const wh = ground.width / 8;
        const hh = ground.height / 8;
        if (self.position.x < center.x - wh || self.position.x > center.x + wh ||
            self.position.y < center.y - hh || self.position.y > center.y + hh) {
          return { do: actions.move, params: { angle: angleBetweenPoints(self.position, center) } };
        } else {
          return { do: actions.none };
        }
      }
    }

    if (self.bullets < creatureMaxBullets[self.level] * 0.7) {
      if (safeBullet.length > 1) {
        const dist = distanceBetween(safeBullet[0], self);
        const angle = angleBetween(self, safeBullet[0]);
        if (dist < 200) {
          return { do: actions.move, params: { angle: angle } };
        }
      } 
    }

    if (enemysRange.length >= 1) {
      const dist = distanceBetween(enemysRange[0], self);
      const backlash = Math.PI / 50.0;
      const directionAngle = angleBetween(self, enemysRange[0]);
      if (self.energy > shotEnergyCost + 20) {
        const diff = Math.abs(differenceBetweenAngles(self.angle, directionAngle));
        if (diff < backlash) {
            return { do: actions.shoot };
        }
        else {
          if (dist > 300) {
            return { do: actions.move, params: { angle: directionAngle } };
          } else {
            return { do: actions.turn, params: { angle: directionAngle } };
          }
        }
      }
    }

    return { do: actions.none };
  }
  
};
