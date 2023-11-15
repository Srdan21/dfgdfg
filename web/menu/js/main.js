'use strict';

var menuItems = [
    {
        id   : 'do',
        title: 'Actions',
        icon: '#people',
        items: [
            {
                id   : 'giveMoney',
                icon: '#money',
                title: 'Pass it on'
            },
            {
                id   : 'friend',
                icon : '#friend',
                title: 'Familiarity'
            },
            {
                id   : 'uncuff',
                title: 'Take it off',
                icon: '#cuff'
            },
            {
                id   : 'cuff',
                title: 'Put on',
                icon: '#cuff'
            },
            {
                id   : 'inCar',
                title: 'drag in',
                icon: '#car'
            },
            {
                id   : 'outCar',
                title: 'take out',
                icon: '#car'
            },
            {
                id   : 'more',
                icon : '#more',
                title: 'More',
                items: [
                    {
                        id   : 'takeGun',
                        icon: '#gun',
                        title: 'Seize the weapon'
                    },
                    {
                        id   : 'takeMask',
                        title: 'Take off the mask',
                        icon: '#mask'
                    },
                    {
                        id   : 'followUs',
                        icon : '#follow',
                        title: 'Lead the way'
                    }
                ]
            }
        ]
    },
    {
        id   : 'run',
        icon   : '#docs',
        title: 'Documents',
        items: [
            {
                id   : 'showGosDoc',
                title: 'ID'
            },
            {
                id   : 'showCardId',
                title: 'Passport'
            },
            {
                id   : 'showLic',
                title: 'Licences'
            }
        ]
    },
    {
        id   : 'home',
        title: 'Home',
        icon: '#home',
        items: [
            {
                id   : 'report',
                icon   : '#report',
                title: 'Complaint'
            },
            {
                id   : 'ask',
                icon   : '#ask',
                title: 'Question'
            },
            {
                id   : 'faq',
                icon   : '#faq',
                title: 'Help'
            },
            {
                id   : 'settings',
                icon   : '#settings',
                title: 'Settings'
            }
        ]
    },
    {
        id   : 'carMenu',
        title: 'Transport',
        icon: '#car',
        items: [
            {
                id   : 'leftIndicator',
                icon   : '#leftArrow',
                title: 'Indicator'
            },
            {
                id   : 'lockV',
                icon   : '#carLock',
                title: 'Open / Close'
            },
            {
                id   : 'rightIndicator',
                icon   : '#rightArrow',
                title: 'Indicator'
            },
            {
                id   : 'twoIndicator',
                icon   : '#twoLight',
                title: 'Emergency'
            },
        ]
    },
    {
        id   : 'anim',
        title: 'Animations',
        icon: '#anim',
        items: [
            {
                id   : 'animDo',
                title: 'Actions',
                items: [
                    {
                        id   : 'animDo1',
                        title: 'Put your hands up'
                    },
                    {
                        id   : 'animDo2',
                        title: 'Military salute'
                    },
                    {
                        id   : 'animDo3',
                        title: 'Accept'
                    },
                    {
                        id   : 'animDo4',
                        title: 'Refuse'
                    },
                    {
                        id   : 'animDo5',
                        title: 'Hand on holster'
                    },
                ]
            },
            {
                id   : 'animPose',
                title: 'Posing',
                items: [
                    {
                        id   : 'animPose1',
                        title: 'Swagger'
                    },
                    {
                        id   : 'animPose2',
                        title: 'Arms at your sides'
                    },
                    {
                        id   : 'animPose3',
                        title: 'Security guard'
                    },
                    {
                        id   : 'animPose4',
                        title: 'Stretch out'
                    },
                    {
                        id   : 'animPose5',
                        title: 'Get down'
                    },
                ]
            },
            {
                id   : 'animEmoji',
                title: 'Emotions',
                items: [
                    {
                        id   : 'animEmoji1',
                        title: 'enjoy'
                    },
                    {
                        id   : 'animEmoji2',
                        title: 'Support'
                    },
                    {
                        id   : 'animEmoji3',
                        title: 'Respect'
                    },
                    {
                        id   : 'animEmoji4',
                        title: 'Disappoint'
                    },
                    {
                        id   : 'animEmoji5',
                        title: 'Stupid'
                    },
                ]
            },
            {
                id   : 'animDance',
                title: 'Dancing',
                items: [
                    {
                        id   : 'animDance1',
                        title: 'Dance-1'
                    },
                    {
                        id   : 'animDance2',
                        title: 'Танец-2'
                    },
                    {
                        id   : 'animDance3',
                        title: 'Dance-3'
                    },
                    {
                        id   : 'animDance4',
                        title: 'Dance-4'
                    },
                    {
                        id   : 'animDance5',
                        title: 'Dance-5'
                    },
                    {
                        id   : 'animDance6',
                        title: 'Dance-6'
                    },
                    {
                        id   : 'animDance7',
                        title: 'Dance-7'
                    },
                    {
                        id   : 'animDance8',
                        title: 'Dance-8'
                    }
                ]
            },
            {
                id   : 'animDoPlayer',
                title: 'With a player',
                items: [
                    {
                        id   : 'animDoPlayer4',
                        title: 'Kiss'
                    },
                    {
                        id   : 'animDoPlayer1',
                        title: 'Gawk 1'
                    },
                    {
                        id   : 'animDoPlayer3',
                        title: 'High-five.'
                    },
                    {
                        id   : 'animDoPlayer2',
                        title: 'Gawk 2'
                    },
                ]
            },
            {
                id   : 'animAll',
                title: 'All animations'
            },
            {
                id   : 'animStop',
                title: 'Stop'
            }
        ]
    },
    {
        id: 'donate',
        title: 'Donate',
        icon: '#money'
    },
    {
        id: 'gps',
        title: 'GPS',
        icon: '#gps'
    }
];

var menuItems2 = [
    {
        id   : 'run',
        title: 'Run'
    }
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let svgMenu = null;
let openAgain = false;

window.onload = function () {

    let sizeMenu = screen.height / 2.8;
    if (sizeMenu < 350)
        sizeMenu = 350;

    svgMenu = new RadialMenu({
        parent      : document.body,
        size        : sizeMenu,
        closeOnClick: true,
        menuItems   : menuItems,
        onClick     : function (item) {

            if (item.id == 'giveMoney' || item.id == 'showGosDoc' || item.id == 'showCardId' || item.id == 'showLic' || item.id == 'friend' || item.id == 'animDoPlayer') {
                openAgain = true;
                setTimeout(function () {
                    openAgain = false;
                    mp.trigger('client:uimenu:trigger', item.id);
                }, 500);
            }
            else
                mp.trigger('client:uimenu:trigger', item.id);

            console.log('You have clicked:', item.id);
        }
    });

    /*var openMenu = document.getElementById('openMenu');
    openMenu.onclick = function () {
        svgMenu.open();
    };

    var closeMenu = document.getElementById('closeMenu');
    closeMenu.onclick = function () {
        svgMenu.close();
    };*/
};

function eventSend(data) {
    try {
        if (data.type == 'show') {
            svgMenu.open();
        }
        else if (data.type == 'hide') {
            svgMenu.close();
        }
        else if (data.type == 'showIdsMenu') {

            try {

                if (data.menuList.length > 0) {
                    svgMenu.menuItems = data.menuList;
                    svgMenu.open();
                }
                else {
                    svgMenu.menuItems = menuItems;
                    mp.trigger('client:uimenu:hide');
                }
            }
            catch (e) {
                mp.trigger('client:console', e);

            }
        }
    } catch (e) {
        
    }
}

document.addEventListener('onClose', function () {
    svgMenu.menuItems = menuItems;
    if (openAgain)
        return;
    //console.log('CLOSE');
    mp.trigger('client:uimenu:hide');
});
