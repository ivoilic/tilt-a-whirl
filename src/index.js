import Matter from 'matter-js';
import { ready } from './utilities';

const main = () => {
  window.addEventListener('deviceorientation', handleOrientation, true);

  // module aliases
  let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create an engine
  let engine = Engine.create({});

  // create a renderer
  let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false
    }
  });

  // create two boxes and a ground
  let boxA = Bodies.rectangle(400, 200, 80, 80);
  let boxB = Bodies.rectangle(450, 50, 80, 80);

  let ceiling = Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
  let wallL = Bodies.rectangle(0, 400, 60, 810, { isStatic: true });
  let wallR = Bodies.rectangle(810, 400, 60, 810, { isStatic: true });
  let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  engine.world.gravity.y = -1;

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground, ceiling, wallL, wallR]);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
};

const handleOrientation = event => {
  var absolute = event.absolute;
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;
};

ready(main);
