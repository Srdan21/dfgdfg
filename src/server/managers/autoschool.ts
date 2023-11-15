/// <reference path="../../declaration/server.ts" />

import { methods } from "../modules/methods"
import { menu } from "../modules/menu";
import { user } from "../user";
import { randomArrayEl } from "../../util/methods";
import { vehicles } from "../vehicles";
import { chat, enabledSystem } from "../modules/chat";
import { getParkPosition } from "./parking";
import { npc, npc_dialog } from "../modules/npc";
import { gtaStrToHtml } from "../../util/string";
import { RAGE_BETA } from "../../util/newrage";

export {}
/** Уникальный ID для генератора */
let ids = 1;


let autoschoolPos = new mp.Vector3(-702.40, -1308.85, 4.11)


let licCost:{
  [name:string]:number;
} = {
  "a":300,
  "b":600,
  "c":1000,
  "air":5000,
  "ship":2000,
}
let licVehs:{
  [name:string]:string;
} = {
  "a":"lectro",
  "b":"asea",
  "c":"mule",
  "air":"buzzard2",
  "ship":"dinghy",
}
let licVehsPos:{
  [name:string]:{x:number;y:number;z:number;h:number}[];
} = {
  "a":[{x:-743.7610473632812,y:-1310.8988037109375,z:4.496565818786621,h:228.7469482421875}],
  "b":[{x:-743.7610473632812,y:-1310.8988037109375,z:4.496565818786621,h:228.7469482421875}],
  "c":[{x:-743.7610473632812,y:-1310.8988037109375,z:4.496565818786621,h:228.7469482421875}],
  "air":[{x: -749.308349609375, y: -1432.199462890625, z: 4.902952671051025, h: 169.6073760986328},],
  "ship":[{x: -832.7066650390625, y: -1439.804931640625, z: -1.1218644380569458, h: 86.00557708740234},],
}

/** Очередь на экзамен */
let examWaitList:Map<number, {
  /** Лицензия */
  lic:string;
  /** Получили экзаменатора или нет? */
  status:boolean;
  /** Начали ли мы прохождения экзамена или нет */
  start:boolean;
}> = new Map();
class autoschoolClass {
  /** Позиция */
  theoryMap: Map<number,(status:boolean)=>any>;
  readonly position: Vector3Mp;
  readonly id: number;
  constructor(position:Vector3Mp){
    ids++;
    this.theoryMap = new Map();
    this.id = ids;
    this.position = position;
    methods.createDynamicCheckpoint(this.position, "Press ~g~E~w~ to open the Licence Centre menu", (player) => {
      // console.log("[AUTOSCHOOL] ENTER DYNAMIC CHECK")
      if(!enabledSystem.autoschool) return player.notify("Licence centre on temporary maintenance. Check back later.")
      this.menu(player)
    }, 2, 0)
    mp.blips.new(77, this.position, {
      dimension: 0,
      name: "Лицензионный центр",
      scale: 0.5,
      color: 25,
      shortRange: true
    })
  }
  menu(player:PlayerMp){
    user.questWorks(player)
    // console.log("[AUTOSCHOOL] OPEN MENU")
    let m = menu.new(player, "Licences", "Licences available");
    let cats = ["a", "b", "c"];
    if(user.get(player, 'fraction_id') == 17){
      m.newItem({
        name: "Awaiting the exam",
        more: [...examWaitList].filter(i => !i[1].start).length,
        onpress: () => {
          this.examsList(player)
        }
      })
    }
    cats.forEach(cat => {
      m.newItem({
        name: "Category "+cat.toUpperCase(),
        more: user.get(player, cat+"_lic") ? "~g~Received" : "~b~Receive (~g~$"+licCost[cat]+"~b~)",
        onpress: () => {
          if(user.get(player, cat+"_lic")) return player.notify("You already have this licence");
          this.startExam(player, cat);
        }
      })
    })
    m.newItem({
      name: "Category "+("Water TC"),
      more: user.get(player, "ship_lic") ? "~g~Received" : "~b~Receive (~g~$"+licCost["ship"]+"~b~)",
      onpress: () => {
        if(user.get(player, "ship_lic")) return player.notify("У вас уже есть данная лицензия");
        this.startExam(player, "ship");
      }
    })
    m.newItem({
      name: "Category "+("Water TC"),
      more: user.get(player, "air_lic") ? "~g~Received" : "~b~Received (~g~$"+licCost["air"]+"~b~)",
      onpress: () => {
        if(user.get(player, "air_lic")) return player.notify("You already have this licence");
        this.startExam(player, "air");
      }
    })
    m.open()
  }

  startExam(player:PlayerMp,lic:string){
    // console.log("[AUTOSCHOOL] START EXAM")
    if(player.autoschoolExam) return player.notify("You're already taking the exam"); 
    
    // if(player.autoschoolExamProtect) return player.notify(`~r~Вы можете повторно сдавать экзамен через ${player.autoschoolExamProtect} мин.`);
    if(user.get(player, lic+"_lic")) return player.notify("You already have this licence");
    let cost = licCost[lic];
    if(user.getMoney(player) < cost) return player.notify("You have insufficient funds to pay");
    // player.autoschoolExamProtect = 10;
    // const check = () => {
    //   if(!mp.players.exists(player)) return;
    //   player.autoschoolExam = null;
    //   player.autoschoolExamProtect--;
    //   if(player.autoschoolExamProtect){
    //     setTimeout(() => {
    //       check();
    //     }, 60000)
    //   } else {
    //     player.autoschoolExamProtect = 0;
    //   }
    // }
    // check();
    player.autoschoolExam = this.id
    user.removeCashMoney(player, cost);
    player.notify("Exam fee paid")
    let cats = ["a", "b", "c"];
    let needPractice = true;
    cats.map((item) => {
      if(user.get(player, item+"_lic")) needPractice = false;
    })
    if(lic.length == 1 && needPractice) this.starTheory(player, lic);
    else this.starPractice(player, lic);
  }

  starPractice(player:PlayerMp, lic:string){
    // console.log("[AUTOSCHOOL] START PRACTICE")
    examWaitList.set(player.id, {lic,status:false,start:false});
    player.notify("~g~Looking for an available instructor, maximum wait time is 30 seconds");
    this.requestExam(player, lic);
    setTimeout(() => {
      if(!mp.players.exists(player)) return;
      if(examWaitList.get(player.id).start) return;
      player.notify("There are no available instructors at this time. Exame will take place automatically")
      this.tehnicalStart(player, lic);
    }, 30000)
    
  }
  requestExam(player:PlayerMp, lic:string){
    if(!mp.players.exists(player)) return;
    // console.log("[AUTOSCHOOL] REQUEST EXAM")
    let getExam = false
    let name = user.getRpName(player);
    mp.players.forEach((target) => {
      if(user.isLogin(target)){
        if(user.get(target, 'fraction_id') == 17){
          if(target.dist(autoschoolPos) < 3000){
            user.accept(target, name+" Examiner required, category "+this.getLicName(lic)).then(status => {
              if(!status) return;
              if(getExam) return target.notify("The exam has already been taken by someone else")
              if(!mp.players.exists(player)) return target.notify("The player has left the server")
              getExam = true;
              examWaitList.get(player.id).status = true;
              player.notify(user.getRpName(target)+" heading your way, expect");
            })
          }
        }
      }
    })
  }
  getLicName(type:string){
    if(type == "a") return "A";
    else if(type == "b") return "B";
    else if(type == "c") return "C";
    else if(type == "air") return "Aviation";
    else if(type == "ship") return "Aquatic";
  }
  examsList(player:PlayerMp){
    // console.log("[AUTOSCHOOL] EXAMS LIST")
    let m = menu.new(player, "Exam", "List");
    examWaitList.forEach((data, targetid) => {
      let target = mp.players.at(targetid);
      if(!mp.players.exists(target)){
        examWaitList.delete(targetid)
      } else {
        if(!data.start){
          m.newItem({
            name: user.getRpName(target),
            more: this.getLicName(data.lic),
            onpress: () => {
              if(target.dist(autoschoolPos) > 50){
                target.notify("Go back to the driving school, the instructor is waiting for you");
                player.notify(user.getRpName(target)+" has left the driving school, wait for him.");
                return;
              }
              if(target.id == player.id) return player.notify("~r~You can't take an exam from yourself");
              this.tehnicalStart(target, data.lic, player);
            }
          })
        }
      }
    })
    m.open()
  }
  tehnicalStart(player:PlayerMp, lic:string, instructor?:PlayerMp){
    // console.log("[AUTOSCHOOL] TEHNICAL START")
    if(!examWaitList.has(player.id)) return;
    if(examWaitList.get(player.id).start) return;
    examWaitList.get(player.id).start = true;
    let tp:any;
    switch (lic) {
      case "a":
        tp = "bike";
        break;
      case "b":
        tp = "vehicle";
        break;
      case "c":
        tp = "truck";
        break;
      case "air":
        tp = "heli";
        break;    
    }
    let part = getParkPosition(new mp.Vector3(-797, -1304, 4), 100, tp);
    let parkPos = tp ? part : null
    let vehicle = newVeh(player, licVehs[lic], parkPos ? parkPos : randomArrayEl(licVehsPos[lic]))
    user.showLoadDisplay(player);
    if(instructor) user.showLoadDisplay(instructor);
    setTimeout(() => {
      if(!mp.players.exists(player)) return;
      if(instructor && !mp.players.exists(instructor)) return;
      if(!mp.vehicles.exists(vehicle)) return;
      player.putIntoVehicle(vehicle, RAGE_BETA ? 0 : -1);
      if (instructor) instructor.putIntoVehicle(vehicle, RAGE_BETA ? 1 : 0);
      user.hideLoadDisplay(player);
      if(instructor) user.hideLoadDisplay(instructor);
      mp.events.callClient(player, "server:autoschool:practice", lic, vehicle.id, instructor ? true : false).then(async (status:boolean) => {
        // console.log("[AUTOSCHOOL] PRACTICE END")
        if(mp.players.exists(instructor) && instructor) status = await user.accept(instructor, "Успешная сдача?");
        player.autoschoolExam = null
        if(instructor) user.teleport(instructor, this.position.x, this.position.y, this.position.z);
        if(instructor && status) user.addCashMoney(instructor, lic.length == 1 ? licCost[lic]*0.5 : licCost[lic]*0.1);
        user.teleport(player, this.position.x, this.position.y, this.position.z);
        if(mp.vehicles.exists(vehicle)) 
        vehicle.destroy();
        if(!status) return player.notify("Вы не сдали практику");
        user.set(player, lic+"_lic", 1);
        player.notify("Вы получили удостоверение категории "+lic);
        user.updateClientCache(player)
        user.questWorks(player)
        examWaitList.delete(player.id)
      });
    }, 1000)
  }
  starTheory(player: PlayerMp, lic: string){
    // console.log("[AUTOSCHOOL] START THEORY")
    if(schools.theoryMap.has(user.getId(player))) schools.theoryMap.delete(user.getId(player))
    menu.close(player);
    user.setGui(player, 'driving_school');
    this.theoryMap.set(user.getId(player), (status:boolean|number) => {
      if(typeof status == "number" && status == 2){
        user.addCashMoney(player, licCost[lic])
        player.notify("~g~We have refunded your exam fees")
        player.autoschoolExam = null
        return
      }
      if(!status){
        player.notify('You didn't pass the theory')
        player.autoschoolExam = null
      } else {
        this.starPractice(player, lic);
      }
    });
  }
}

setTimeout(() => {
  mp.events.register('client:autoschool:theory', (player:PlayerMp, status:boolean) => {
    if(!mp.players.exists(player)) return;
    if(!schools.theoryMap.has(user.getId(player))) return;
    schools.theoryMap.get(user.getId(player))(status);
    schools.theoryMap.delete(user.getId(player))
  })
  mp.events.register('client:autoschool:theory:close', (player:PlayerMp) => {
    if(!mp.players.exists(player)) return;
    if(!schools.theoryMap.has(user.getId(player))) return;
    // @ts-ignore
    schools.theoryMap.get(user.getId(player))(2);
    schools.theoryMap.delete(user.getId(player))
  })
}, 1000)





function newVeh(player:PlayerMp, car:string, spawn:{x:number;y:number;z:number;h:number;}){
  // console.log("[AUTOSCHOOL] NEW VEHICLE")
  let carConf = methods.getVehicleInfo(car);
  let vehicle = mp.vehicles.new(car, new mp.Vector3(spawn.x,spawn.y,spawn.z+0.5), {
    locked: false,
    engine: true,
    heading: spawn.h
  })
  vehicle.setVariable('fuel', carConf.fuel_full);
  vehicle.position = new mp.Vector3(spawn.x,spawn.y,spawn.z+0.5);
  vehicle.numberPlate = user.getId(player).toString()+" EX";
  vehicle.setColorRGB(255, 255, 255, 255, 255, 255);
  vehicles.setFuelFull(vehicle)
  vehicles.lockStatus(player, vehicle, false);
  vehicles.engineStatus(player, vehicle, true);
  setTimeout(() => {
    if(!mp.vehicles.exists(vehicle)) return;
    vehicle.position = new mp.Vector3(spawn.x,spawn.y,spawn.z+0.5);
    setTimeout(() => {
      if (!mp.vehicles.exists(vehicle)) return;
      vehicle.position = new mp.Vector3(spawn.x,spawn.y,spawn.z+0.5);
      vehicle.repair();
    }, 200)
  }, 200)
  return vehicle
}

chat.registerCommand("pointcatch", (player) => {
  if(!user.isAdminNow(player)) return;
  let points:{
    x:number;
    y:number;
    z:number;
    h:number;
  }[] = [];
  let m = menu.new(player, "Assembly");
  m.newItem({
    name: "Новая",
    onpress: () => {
      player.notify("Количество точек: "+points.push(player.vehicle ? {
        ...player.vehicle.position,
        h:player.vehicle.heading
      } : {
        ...player.position,
        h:player.heading
      }))
    }
  })
  m.newItem({
    name: "Save",
    onpress: () => {
      methods.saveLog("pointCatch", JSON.stringify(points));
    }
  })
  m.open();
})
let schools = new autoschoolClass(autoschoolPos);


npc_dialog.new("Antonio", "Instructor", new mp.Vector3(-705.78, -1303.13, 5.11), 60.42, "ig_tomepsilon", (player) => {
  npc_dialog.open(player, `Hello. Choose what you are interested in`, ["san andreas state traffic regulations", "Road Traffic Order", "General Rules", "Starting Traffic, Manoeuvring", "Traffic Light and Regulator Signals", "Overtaking Rules", "Road Markings", "Use of External Lights and Sound Signals", "Nothing, Thanks"]).then(res => {
    let text = "";
    if(res == 0) text = `Road Traffic Rules - a set of rules governing the obligations of road users (drivers of vehicles, their passengers, pedestrians, etc.), as well as technical requirements for vehicles to ensure road safety.`;
    if(res == 1) text = `-  The movement of vehicles is right-handed.
    -  All road users, traffic organisers and other persons shall comply with the requirements of legal acts on road traffic, be attentive and prudent in road traffic and ensure the rhythm of traffic in order to prevent danger and harm.
    `
    if(res == 2) text = `- you can only receive training in driving a car or motorbike from the age of 16.
    - Before starting to drive, rearranging, turning (U-turn) and stopping, the driver must signal with the direction indicator lights of the appropriate direction
    - When approaching a vehicle with a blue flashing beacon and a special sound signal switched on, drivers are obliged to give way in order to ensure the unobstructed passage of the said vehicle. 
    - When a vehicle drives off with its right wheels on an unreinforced and wet kerb, there is a risk of skidding due to the difference in grip of the right and left wheels on the road. It is advisable to return the car to the carriageway by turning the steering wheel without changing speed, i.e. without braking. Braking in this situation may cause the car to skid.`;
    if(res == 3) text = `- Before starting to move, rearrangement, turning (U-turn) and stopping, the driver shall be obliged to signal with the direction indicator lights of the appropriate direction
    - When changing lanes, the driver shall give way to vehicles travelling on the opposite side of the road without changing the direction of movement. When simultaneously realigning vehicles travelling on the opposite side of the road, the driver shall give way to the vehicle on the right.
    - When entering the road from the adjacent territory, the driver shall give way to vehicles and pedestrians travelling on it, and when leaving the road - to pedestrians and cyclists whose path of movement he crosses`
    if(res == 4) text = `The round traffic light signals have the following meanings:
    - GREEN SIGNAL authorises traffic;
    - GREEN flashing signal authorises traffic and informs you that a prohibited signal is about to be switched on.
    - YELLOW flashing signal authorises traffic and informs you that there is an unregulated junction or pedestrian crossing and warns of danger;
    - RED SIGNAL, including flashing, prohibits traffic.`
    if(res == 5) text = `Before starting overtaking, the driver must make sure that:
    - the driver of the vehicle ahead in the same lane has not signalled his intention to turn (change lane) to the left;
    - the lane intended for oncoming traffic is free at a sufficient distance for overtaking;
    - your vehicle is not being overtaken.
    - The driver of the vehicle being overtaken is prohibited from obstructing the overtaking by increasing the speed or other actions.`
    if(res == 6) text = `White and yellow lines - Can be solid or broken, single or double. They are used to separate lanes and separate traffic flows.
    Yellow lines - Separate the lanes of vehicles travelling in the opposite direction. A single yellow line can also separate the right-hand edge of the kerb on a motorway.
    White lines - separates the lanes of vehicles travelling in the same direction. A single yellow line may also separate the right-hand edge of the kerb on a motorway.
    - Interrupted single yellow line - Keep to the right of the line unless you are overtaking the vehicle ahead. You may cross the dashed yellow line only to safely overtake vehicles ahead, and when crossing a junction where the road markings indicate this.
    - Interrupted-solid double yellow line - A solid yellow line to the right of the interrupted yellow line means that overtaking is prohibited on the oncoming lane in this section (except for safe left turns at junctions, passing straight ahead at junctions if this is indicated by a road marking in the form of a direction arrow in your lane "straight ahead only"). If the dashed yellow line is to the right of the solid yellow line you can overtake the vehicle ahead and take your lane (even crossing the solid yellow line).
    - Double yellow line - Overtaking is prohibited on this section of road. Crossing the double yellow line`
    if(res == 7) text = `-  In the dark and in conditions of insufficient visibility, irrespective of the illumination of the road, and in tunnels, the following lights shall be switched on on a moving vehicle:
    on all motor vehicles - headlights of high beam or dipped beam, on bicycles - headlights or lights, on go-carts - lights (if any);
    - High beam shall be switched to dipped beam:
    in populated areas, if the road is illuminated;
    at oncoming traffic at a distance of at least 150 metres from the vehicle, and even more if the driver of the oncoming vehicle shows the necessity to do so by periodically switching the headlamps;
    in any other case to avoid the possibility of dazzling the drivers of both oncoming and passing vehicles.`
    if(!text) return npc_dialog.close(player);
    npc_dialog.open(player, gtaStrToHtml(text), ["Thank you for the information"])
  });
})

mp.events.add("playerJoin", (player:PlayerMp) => {
  player.autoschoolExam = null;
})
