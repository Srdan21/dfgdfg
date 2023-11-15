/// <reference path="../../declaration/server.ts" />

import { methods } from "../modules/methods"
import { menu } from "../modules/menu";
import { user } from "../user";
import { randomArrayEl } from "../../util/methods";
import { vehicles } from "../vehicles";
import { chat } from "../modules/chat";

chat.registerCommand('camera', (player) => {
  if(!user.isAdminNow(player)) return player.notify("Available to administrators only");
  cameraManager(player)
})
type cameraSettingsMode = "Normal"|"Look at the TC"|"Look at the player.";
export interface cameraSettings {
  pos1: Vector3Mp;
  pos2: Vector3Mp;
  rot1: Vector3Mp;
  rot2: Vector3Mp;
  mode: cameraSettingsMode;
  target: number;
  fov: number;
  duration: number;
}

function cameraManager(player:PlayerMp, settings?:cameraSettings){
  if(!settings && !player.cameraManagerSettings) settings = {
    pos1 : null,
    pos2 : null,
    rot1 : null,
    rot2 : null,
    mode : "Обычный",
    target : null,
    fov: 50,
    duration: 5
  }; else if(player.cameraManagerSettings && !settings) settings = player.cameraManagerSettings
  player.cameraManagerSettings = settings
  let m = menu.new(player, "Camera," "Settings.");
  let mods:cameraSettingsMode[] = ["Normal," "Look at the TC," "Look at the player."];
  if(mods.indexOf(settings.mode) == -1) settings.mode = "Normal";
  m.exitProtect = true;
  m.newItem({
    name: "Режим работы",
    type: "list",
    list: mods,
    listSelected: mods.indexOf(settings.mode),
    onchange: (value, item) => {
      player.notify("Camera mode changed to: "+item.listSelectedName)
      settings.mode = <cameraSettingsMode>item.listSelectedName;
      if(settings.target){
        settings.target = null;
        player.notify("The target of the stakeout has been dropped")
      }
      cameraManager(player, settings)
    }
  })
  m.newItem({
    name: "~r~Reset settings",
    onpress: () => {
      user.accept(player, "Reset the settings?").then(status => {
        if(!status) return cameraManager(player, settings);
        settings = null
        player.cameraManagerSettings = null
        player.notify("Settings reset")
        cameraManager(player, settings)
      })
    }
  })
  m.newItem({
    name: "~b~Initial camera"
  })
  m.newItem({
    name: "Position",
    desc: "Coordinate where you are now",
    more: settings.pos1 ? "~g~Installed" : "~r~Uninstalled",
    onpress: () => {
      if(settings.pos1){
        user.accept(player, "Reset the point?").then(status => {
          if(!status) return cameraManager(player, settings);
          settings.pos1 = null
          player.notify("Camera position reset")
          cameraManager(player, settings)
        })
      } else {
        settings.pos1 = new mp.Vector3(player.position.x, player.position.y, player.position.z)
        player.notify("Camera position set")
        cameraManager(player, settings)
      }
    }
  })
  m.newItem({
    name: "Direction",
    more: settings.rot1 ? "~g~Installed" : "~r~Uninstalled",
    onpress: () => {
      if(settings.rot1){
        user.accept(player, "Reset the point?").then(status => {
          if(!status) return cameraManager(player, settings);
          settings.rot1 = null
          player.notify("Camera position reset")
          cameraManager(player, settings)
        })
      } else {
        mp.events.callClient(player, "camera:rotationCamera").then((pos) => {
          //console.log(pos)
          settings.rot1 = new mp.Vector3(pos.x, pos.y, pos.z)
          player.notify("Camera position set")
          cameraManager(player, settings)
        })
      }
    }
  })
  m.newItem({
    name: "~b~End cell"
  })


  m.newItem({
    name: "Position",
    desc: "Coordinate where you are now",
    more: settings.pos2 ? "~g~Установлена" : "~r~Не установлена",
    onpress: () => {
      if(settings.pos2){
        user.accept(player, "Сбросить точку?").then(status => {
          if(!status) return cameraManager(player, settings);
          settings.pos2 = null
          player.notify("Положение камеры сброшено")
          cameraManager(player, settings)
        })
      } else {
        settings.pos2 = new mp.Vector3(player.position.x, player.position.y, player.position.z)
        player.notify("Положение камеры установлено")
        cameraManager(player, settings)
      }
    }
  })
  m.newItem({
    name: "Направление",
    more: settings.rot2 ? "~g~Установлено" : "~r~Не установлено",
    onpress: () => {
      if(settings.rot2){
        user.accept(player, "Сбросить точку?").then(status => {
          if(!status) return cameraManager(player, settings);
          settings.rot2 = null
          player.notify("Положение камеры сброшено")
          cameraManager(player, settings)
        })
      } else {
        mp.events.callClient(player, "camera:rotationCamera").then((pos) => {
          //console.log(pos)
          settings.rot2 = new mp.Vector3(pos.x, pos.y, pos.z)
          player.notify("Положение камеры установлено")
          cameraManager(player, settings)
        })
      }
    }
  })
  m.newItem({
    name: "Цель слежки",
    more: settings.target ? "~g~Установлено" : "~r~Не установлено",
    onpress: () => {
      if(settings.mode == "Смотреть на ТС"){
        menu.input(player, "Введите номерной знак ТС").then(plate => {
          let veh = vehicles.findVehicleByNumber(plate);
          if(!veh) return player.notify("ТС не обнаружен");
          settings.target = veh.id;
          cameraManager(player, settings)
        })
      } else if(settings.mode == "Смотреть на игрока"){
        menu.input(player, "Введите ID игрока").then(ids => {
          let target = user.getPlayerById(methods.parseInt(ids));
          if(!target) return player.notify("Игрок не обнаружен");
          settings.target = target.id;
          cameraManager(player, settings)
        })
      } else {
        settings.target = null;
        player.notify("В данном режиме нет цели слежки, параметр сброшен")
        cameraManager(player, settings)
      }
    }
  })
  m.newItem({
    name: "Fov",
    more: settings.fov,
    onpress: () => {
      menu.input(player, "Введите fov").then(ids => {
        settings.fov = methods.parseInt(ids);
        cameraManager(player, settings)
      })
    }
  })
  m.newItem({
    name: "Длительность",
    more: settings.duration,
    desc: "В секундах",
    onpress: () => {
      menu.input(player, "Введите время в секундах").then(ids => {
        settings.duration = methods.parseInt(ids);
        cameraManager(player, settings)
      })
    }
  })
  m.newItem({
    name: "Включить камеру",
    onpress: () => {
      if(!settings.pos1 && !settings.pos2) return player.notify("Настройте камеру");
      m.close();
      mp.events.callClient(player, "camera:start", settings).then(() => {
        cameraManager(player, settings)
      });
    }
  })
  m.open();
}
