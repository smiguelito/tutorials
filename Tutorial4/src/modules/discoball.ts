const NUM_LASERS = 18

@Component("Laser")
export class Laser {
  cycleForward: boolean = true
}

@Component("InvisEntity")
export class InvisEntity {}

@Component("Ball")
export class Ball {}

// Rotates disco ball and lasers; flickers laser rays randomly
export class DiscoSystem {
  update(dt: number) {
    const laserList = engine.getComponentGroup(Laser)
    const invisEntityList = engine.getComponentGroup(InvisEntity)
    for (let entity of laserList.entities){
      let rotX = entity.getComponent(Transform).rotation.eulerAngles.x
      let cycleForward = entity.getComponent(Laser).cycleForward
      if (cycleForward){
        if (rotX > -130 && rotX < 0){
          entity.getComponent(Laser).cycleForward = false
        } else {
          entity.getComponent(Transform).rotate(Vector3.Right(), dt * 15)
        }
      } else {
        if (rotX < 130 && rotX > 0){
          entity.getComponent(Laser).cycleForward = true
        } else {
          entity.getComponent(Transform).rotate(Vector3.Left(), dt * 15)
        }
      }
    }
    for (let entity of invisEntityList.entities){
      entity.getComponent(Transform).rotate(Vector3.Up(), dt * 15)
    }
    engine.getComponentGroup(Ball).entities[0].getComponent(Transform).rotate(Vector3.Up(), dt * 30)
    if (Math.random() <= 0.1){
      const flicker = engine.getComponentGroup(Laser).entities[Math.floor(Math.random()*NUM_LASERS)]
      flicker.getComponent(GLTFShape).visible = !flicker.getComponent(GLTFShape).visible
    }
  }
}

let activeDiscoSystem = new DiscoSystem()

export class DiscoBall {
  discoball: Entity = new Entity()
  position: Vector3;
  scale: number;

  constructor(position: Vector3, scale: number) {
    this.position = position;
    this.scale = scale;

    this.spawnBall();
    this.spawnLasers();
    engine.addSystem(activeDiscoSystem)
  }

  spawnBall() {
    // Creates disco ball entity
    this.discoball.addComponent(new GLTFShape("models/disco/discoball.glb"))
    this.discoball.addComponent(new Transform({
      position: this.position,
      scale: new Vector3(this.scale, this.scale, this.scale)
    }))
    this.discoball.addComponent(new Ball())
    engine.addEntity(this.discoball)
  }
  
  spawnLasers() {
    const laserColorArray: string[] = ["models/disco/laser_red.glb", "models/disco/laser_green.glb", "models/disco/laser_blue.glb", "models/disco/laser_magenta.glb",
    "models/disco/laser_cyan.glb", "models/disco/laser_yellow.glb"]

    // Creates laser rays
    for (let i = 0; i < NUM_LASERS; i++){
      const invisEntity = new Entity()
      invisEntity.addComponent(new InvisEntity())
      invisEntity.addComponent(new Transform({
        position: this.position,
        rotation: Quaternion.Euler(0, 180-360*Math.random(), 0)
      }))
      engine.addEntity(invisEntity)

      let laserColor = laserColorArray[Math.floor(Math.random()*laserColorArray.length)]
      const laser = new Entity()
      laser.setParent(invisEntity)
      laser.addComponent(new Laser())
      laser.addComponent(new GLTFShape(laserColor))
      laser.addComponent(new Transform({
        rotation: Quaternion.Euler([-1, 1][Math.floor(Math.random()*2)]*(130+50*Math.random()), 0, 0)
      }))
      engine.addEntity(laser)
    }
  }
}