function score(){
var wsColor = 15991011;

var fod = [{"p":[-25,25,125],"c":16248576},{"p":[-25,25,75],"c":16248576},{"p":[-25,25,25],"c":16248576},{"p":[25,25,125],"c":16248576},{"p":[25,25,75],"c":16248576},{"p":[25,25,25],"c":16248576},{"p":[75,25,125],"c":16248576},{"p":[75,25,75],"c":16248576},{"p":[75,25,25],"c":16248576},{"p":[-25,75,75],"c":16248576},{"p":[-25,75,125],"c":15991011},{"p":[25,75,125],"c":15991011},{"p":[25,75,75],"c":15991011},{"p":[25,75,25],"c":15991011},{"p":[-25,75,25],"c":15991011},{"p":[75,75,125],"c":15991011},{"p":[75,75,75],"c":15991011},{"p":[75,75,25],"c":15991011},{"p":[-25,25,-25],"c":15991011},{"p":[25,25,-25],"c":15991011},{"p":[75,25,-25],"c":15991011},{"p":[125,25,125],"c":15991011},{"p":[125,25,75],"c":15991011},{"p":[125,25,25],"c":15991011},{"p":[-25,25,175],"c":15991011},{"p":[25,25,175],"c":15991011},{"p":[75,25,175],"c":15991011},{"p":[-75,25,-25],"c":15991011},{"p":[-75,25,25],"c":15991011},{"p":[-75,25,75],"c":15991011},{"p":[-75,25,125],"c":15991011},{"p":[-75,25,175],"c":15991011},{"p":[-75,75,25],"c":15991011},{"p":[-75,75,75],"c":15991011},{"p":[-75,75,125],"c":15991011}];

var hovede = [{"p":[-25,25,25],"c":16777215},{"p":[-25,25,-25],"c":16777215},{"p":[-25,25,-75],"c":16777215},{"p":[-25,75,25],"c":16777215},{"p":[-25,75,-25],"c":16777215},{"p":[-25,75,-75],"c":16777215},{"p":[-125,125,25],"c":16777215},{"p":[-125,125,-25],"c":16777215},{"p":[-125,125,-75],"c":16777215},{"p":[-75,125,25],"c":16777215},{"p":[-75,125,-25],"c":16777215},{"p":[-75,125,-75],"c":16777215},{"p":[-25,125,25],"c":2236962},{"p":[-25,125,-25],"c":16777215},{"p":[-25,125,-75],"c":2236962},{"p":[-125,175,25],"c":16777215},{"p":[-125,175,-25],"c":16777215},{"p":[-125,175,-75],"c":16777215},{"p":[-75,175,25],"c":16777215},{"p":[-75,175,-25],"c":16777215},{"p":[-75,175,-75],"c":16777215},{"p":[-25,175,25],"c":16777215},{"p":[-25,175,-25],"c":16777215},{"p":[-25,175,-75],"c":16777215},{"p":[-25,125,75],"c":15991011},{"p":[-75,125,75],"c":15991011},{"p":[-125,125,75],"c":15991011},{"p":[-175,125,-75],"c":15991011},{"p":[-175,125,-25],"c":15991011},{"p":[-175,125,25],"c":15991011},{"p":[-175,175,-75],"c":15991011},{"p":[-175,175,-25],"c":15991011},{"p":[-175,175,25],"c":15991011},{"p":[-125,175,75],"c":15991011},{"p":[-75,175,75],"c":15991011},{"p":[-25,175,75],"c":15991011},{"p":[-25,125,-125],"c":15991011},{"p":[-75,125,-125],"c":15991011},{"p":[-125,125,-125],"c":15991011},{"p":[-25,175,-125],"c":15991011},{"p":[-75,175,-125],"c":15991011},{"p":[-125,175,-125],"c":15991011},{"p":[-125,225,25],"c":15991011},{"p":[-125,225,-25],"c":15991011},{"p":[-125,225,-75],"c":15991011},{"p":[-75,225,25],"c":15991011},{"p":[-75,225,-25],"c":15991011},{"p":[-75,225,-75],"c":15991011},{"p":[-25,225,25],"c":15991011},{"p":[-25,225,-25],"c":15991011},{"p":[-25,225,-75],"c":15991011},{"p":[25,175,25],"c":15991011},{"p":[25,175,-25],"c":15991011},{"p":[25,175,-75],"c":15991011},{"p":[25,125,25],"c":15991011},{"p":[25,125,-25],"c":15991011},{"p":[25,125,-75],"c":15991011}];

var krop = [{"p":[-25,25,125],"c":16777215},{"p":[25,25,125],"c":16777215},{"p":[75,25,125],"c":16777215},{"p":[125,25,125],"c":16777215},{"p":[125,25,75],"c":16777215},{"p":[125,25,25],"c":16777215},{"p":[125,25,-25],"c":16777215},{"p":[125,25,-75],"c":16777215},{"p":[-25,25,75],"c":16777215},{"p":[-25,25,25],"c":16777215},{"p":[-25,25,-25],"c":16777215},{"p":[-25,25,-75],"c":16777215},{"p":[25,25,-75],"c":16777215},{"p":[75,25,-75],"c":16777215},{"p":[25,25,75],"c":16777215},{"p":[25,25,25],"c":16777215},{"p":[25,25,-25],"c":16777215},{"p":[75,25,75],"c":16777215},{"p":[75,25,25],"c":16777215},{"p":[75,25,-25],"c":16777215},{"p":[125,75,125],"c":16777215},{"p":[125,75,-75],"c":16777215},{"p":[25,75,125],"c":16777215},{"p":[75,75,125],"c":16777215},{"p":[75,75,75],"c":16777215},{"p":[75,75,25],"c":16777215},{"p":[75,75,-25],"c":16777215},{"p":[75,75,-75],"c":16777215},{"p":[25,75,75],"c":16777215},{"p":[25,75,25],"c":16777215},{"p":[25,75,-25],"c":16777215},{"p":[25,75,-75],"c":16777215},{"p":[-25,75,125],"c":16777215},{"p":[-25,75,75],"c":16777215},{"p":[-25,75,25],"c":16777215},{"p":[-25,75,-25],"c":16777215},{"p":[-25,75,-75],"c":16777215},{"p":[125,125,125],"c":16777215},{"p":[75,125,125],"c":16777215},{"p":[25,125,125],"c":16777215},{"p":[-25,125,125],"c":16777215},{"p":[-25,125,75],"c":16777215},{"p":[-25,125,25],"c":16777215},{"p":[-25,125,-25],"c":16777215},{"p":[-25,125,-75],"c":16777215},{"p":[25,125,75],"c":16777215},{"p":[25,125,25],"c":16777215},{"p":[25,125,-25],"c":16777215},{"p":[25,125,-75],"c":16777215},{"p":[75,125,75],"c":16777215},{"p":[75,125,25],"c":16777215},{"p":[75,125,-25],"c":16777215},{"p":[75,125,-75],"c":16777215},{"p":[125,125,-75],"c":16777215}];

var vinge = [{"p":[-75,25,25],"c":16777215},{"p":[-25,25,25],"c":16777215},{"p":[25,25,25],"c":16777215},{"p":[75,25,25],"c":16777215},{"p":[-75,75,25],"c":16777215},{"p":[-25,75,25],"c":16777215},{"p":[25,75,25],"c":16777215},{"p":[75,75,25],"c":16777215},{"p":[75,25,-25],"c":15991011},{"p":[25,25,-25],"c":15991011},{"p":[-25,25,-25],"c":15991011},{"p":[-75,25,-25],"c":15991011},{"p":[75,75,-25],"c":15991011},{"p":[25,75,-25],"c":15991011},{"p":[-25,75,-25],"c":15991011},{"p":[-75,75,-25],"c":15991011},{"p":[125,25,25],"c":15991011},{"p":[125,75,25],"c":15991011},{"p":[-75,125,25],"c":15991011},{"p":[-25,125,25],"c":15991011},{"p":[25,125,25],"c":15991011},{"p":[75,125,25],"c":15991011},{"p":[-125,25,25],"c":15991011},{"p":[-125,75,25],"c":15991011}];

var naeb = [{"p":[-25,25,-25],"c":15990784},{"p":[-25,75,-25],"c":16248576},{"p":[-25,75,25],"c":16248576},{"p":[-25,75,-75],"c":16248576},{"p":[25,75,25],"c":16248576},{"p":[25,75,-25],"c":16248576},{"p":[25,75,-75],"c":16248576},{"p":[-25,25,-75],"c":15991011},{"p":[25,25,-75],"c":15991011},{"p":[-25,25,25],"c":15991011},{"p":[25,25,25],"c":15991011},{"p":[25,25,-25],"c":15991011},{"p":[-25,75,75],"c":15991011},{"p":[25,75,75],"c":15991011},{"p":[75,75,-75],"c":15991011},{"p":[75,75,-25],"c":15991011},{"p":[75,75,25],"c":15991011},{"p":[-25,75,-125],"c":15991011},{"p":[25,75,-125],"c":15991011},{"p":[25,125,25],"c":15991011},{"p":[25,125,-25],"c":15991011},{"p":[25,125,-75],"c":15991011},{"p":[-25,125,25],"c":15991011},{"p":[-25,125,-25],"c":15991011},{"p":[-25,125,-75],"c":15991011}];

var helKylling = [{"p":[25,25,125],"c":16248576},{"p":[25,25,75],"c":16248576},{"p":[25,25,25],"c":16248576},{"p":[75,25,125],"c":16248576},{"p":[75,25,75],"c":16248576},{"p":[75,25,25],"c":16248576},{"p":[125,25,125],"c":16248576},{"p":[125,25,75],"c":16248576},{"p":[125,25,25],"c":16248576},{"p":[25,75,75],"c":16248576},{"p":[25,25,-75],"c":16248576},{"p":[75,25,-75],"c":16248576},{"p":[125,25,-75],"c":16248576},{"p":[25,25,-125],"c":16248576},{"p":[25,25,-175],"c":16248576},{"p":[75,25,-125],"c":16248576},{"p":[75,25,-175],"c":16248576},{"p":[125,25,-125],"c":16248576},{"p":[125,25,-175],"c":16248576},{"p":[25,75,-125],"c":16248576},{"p":[25,125,75],"c":16777215},{"p":[25,125,25],"c":16777215},{"p":[25,125,-25],"c":16777215},{"p":[25,125,-75],"c":16777215},{"p":[25,125,-125],"c":16777215},{"p":[75,125,75],"c":16777215},{"p":[75,125,25],"c":16777215},{"p":[75,125,-25],"c":16777215},{"p":[75,125,-75],"c":16777215},{"p":[75,125,-125],"c":16777215},{"p":[-25,125,-125],"c":16777215},{"p":[-25,125,-75],"c":16777215},{"p":[-25,125,-25],"c":16777215},{"p":[-25,125,25],"c":16777215},{"p":[-25,125,75],"c":16777215},{"p":[-75,125,-125],"c":16777215},{"p":[-75,125,-75],"c":16777215},{"p":[-75,125,-25],"c":16777215},{"p":[-75,125,25],"c":16777215},{"p":[-75,125,75],"c":16777215},{"p":[75,175,-125],"c":16777215},{"p":[25,175,-125],"c":16777215},{"p":[-25,175,-125],"c":16777215},{"p":[-75,175,-125],"c":16777215},{"p":[75,175,-75],"c":16777215},{"p":[25,175,-75],"c":16777215},{"p":[-25,175,-75],"c":16777215},{"p":[-75,175,-75],"c":16777215},{"p":[75,175,-25],"c":16777215},{"p":[25,175,-25],"c":16777215},{"p":[-25,175,-25],"c":16777215},{"p":[-75,175,-25],"c":16777215},{"p":[75,175,25],"c":16777215},{"p":[25,175,25],"c":16777215},{"p":[-25,175,25],"c":16777215},{"p":[-75,175,25],"c":16777215},{"p":[75,175,75],"c":16777215},{"p":[25,175,75],"c":16777215},{"p":[-25,175,75],"c":16777215},{"p":[-75,175,75],"c":16777215},{"p":[75,225,-125],"c":16777215},{"p":[25,225,-125],"c":16777215},{"p":[-25,225,-125],"c":16777215},{"p":[-75,225,-125],"c":16777215},{"p":[75,225,-75],"c":16777215},{"p":[25,225,-75],"c":16777215},{"p":[-25,225,-75],"c":16777215},{"p":[-75,225,-75],"c":16777215},{"p":[75,225,-25],"c":16777215},{"p":[25,225,-25],"c":16777215},{"p":[-25,225,-25],"c":16777215},{"p":[-75,225,-25],"c":16777215},{"p":[75,225,25],"c":16777215},{"p":[25,225,25],"c":16777215},{"p":[-25,225,25],"c":16777215},{"p":[-75,225,25],"c":16777215},{"p":[75,225,75],"c":16777215},{"p":[25,225,75],"c":16777215},{"p":[-25,225,75],"c":16777215},{"p":[-75,225,75],"c":16777215},{"p":[25,225,125],"c":16777215},{"p":[-25,225,125],"c":16777215},{"p":[-75,225,125],"c":16777215},{"p":[-125,225,125],"c":16777215},{"p":[25,175,125],"c":16777215},{"p":[-25,175,125],"c":16777215},{"p":[-75,175,125],"c":16777215},{"p":[-125,175,125],"c":16777215},{"p":[25,225,-175],"c":16777215},{"p":[-25,225,-175],"c":16777215},{"p":[-75,225,-175],"c":16777215},{"p":[-125,225,-175],"c":16777215},{"p":[25,175,-175],"c":16777215},{"p":[-25,175,-175],"c":16777215},{"p":[-75,175,-175],"c":16777215},{"p":[-125,175,-175],"c":16777215},{"p":[125,225,25],"c":16777215},{"p":[125,225,-25],"c":16777215},{"p":[125,225,-75],"c":16777215},{"p":[125,175,25],"c":16777215},{"p":[125,175,-25],"c":16777215},{"p":[125,175,-75],"c":16777215},{"p":[25,275,25],"c":16777215},{"p":[75,275,25],"c":16777215},{"p":[25,275,-25],"c":16777215},{"p":[75,275,-25],"c":16777215},{"p":[125,275,-25],"c":16777215},{"p":[25,275,-75],"c":16777215},{"p":[75,275,-75],"c":16777215},{"p":[25,325,25],"c":16777215},{"p":[75,325,25],"c":16777215},{"p":[125,325,25],"c":16777215},{"p":[25,325,-75],"c":16777215},{"p":[75,325,-75],"c":16777215},{"p":[125,325,-75],"c":16777215},{"p":[25,325,-25],"c":16777215},{"p":[75,325,-25],"c":16777215},{"p":[125,325,-25],"c":16777215},{"p":[125,275,-75],"c":2236962},{"p":[125,275,25],"c":2236962},{"p":[175,225,25],"c":16248576},{"p":[175,225,-25],"c":16248576},{"p":[175,225,-75],"c":16248576},{"p":[225,225,25],"c":16248576},{"p":[225,225,-25],"c":16248576},{"p":[225,225,-75],"c":16248576},{"p":[175,175,-25],"c":15990784}];

return {
  fod : Scoring.find(fod, false, wsColor).length >= 2 ? 1 : 0,
  fod_farve : Scoring.find(fod, true, wsColor).length >= 2 ? 1 : 0,
  hovede : Scoring.find(hovede, false, wsColor).length > 0 ? 1 : 0,
  hoved_farver : Scoring.find(hovede, true, wsColor).length > 0 ? 1 : 0,
  naeb: Scoring.find(naeb, false, wsColor).length > 0 ? 1 : 0,
  naeb_farver: Scoring.find(naeb, true, wsColor).length > 0 ? 1 : 0,
  krop: Scoring.find(krop, false, wsColor).length > 0 ? 1 : 0,
  vinger: Scoring.find(vinge, false, wsColor).length >= 2 ? 1 : 0,
  vinger_farve: Scoring.find(vinge, true, wsColor).length >= 2 ? 1 : 0,
  hel_kylling: Scoring.find(helKylling, false, wsColor).length > 0 ? 1 : 0,
  hel_kylling_farve: Scoring.find(helKylling, true, wsColor).length > 0 ? 1 : 0,
  alle_farver: (Scoring.find([{"p":[25,25,125],"c":16248576}]).length
    && Scoring.find([{"p":[25,25,125],"c":16777215}]).length
    && Scoring.find([{"p":[25,25,125],"c":2236962}]).length
    && Scoring.find([{"p":[25,25,125],"c":15990784}]).length) ? 1 : 0
};
}