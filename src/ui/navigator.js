// Generated by CoffeeScript 2.7.0
(function () {
  //search for cell  clusters and navigate through them
  var DomBuilder, E, Navigator, allClusters;

  ({ allClusters } = require("../core/field.js"));

  ({ DomBuilder } = require("./dom_builder.js"));

  ({ E } = require("./htmlutil.js"));

  exports.Navigator = Navigator = class Navigator {
    constructor(
      application,
      navigatorElemId = "navigator-cluster-list"
      //btnClearId = "btn-nav-clear"
    ) {
      this.application = application;
      this.clustersElem = E(navigatorElemId);
      //this.btnClear = E(btnClearId);
      this.clusters = [];
      //this.btnClear.style.display = "none";
    }

    search(field) {
      //field is ChainMap
      this.clusters = allClusters(field, this.application.tiling);
      this.sortBySize();
      this.updateClusterList();
      //this.btnClear.style.display = this.clusters ? "" : "none";
      return this.clusters.length;
    }

    sortByDistance() {
      return this.clusters.sort(function (a, b) {
        var d;
        d = b[0].len() - a[0].len();
        if (d !== 0) {
          return d;
        }
        d = b.length - a.length;
        return d;
      });
    }

    sortBySize() {
      return this.clusters.sort(function (a, b) {
        var d;
        d = b.length - a.length;
        if (d !== 0) {
          return d;
        }
        d = b[0].len() - a[0].len();
        return d;
      });
    }

    makeNavigateTo(chain) {
      return (e) => {
        var observer;
        e.preventDefault();
        //console.log JSON.stringify chain
        observer = this.application.getObserver();
        if (observer != null) {
          observer.navigateTo(chain);
        }
      };
    }

    navigateToResult(index) {
      var observer;
      observer = this.application.getObserver();
      if (observer != null) {
        return observer.navigateTo(this.clusters[index][0]);
      }
    }

    /*clear() {
      this.clusters = [];
      this.clustersElem.innerHTML = "";
      return (this.btnClear.style.display = "none");
    }*/

    updateClusterList() {
      var cluster, dist, dom, i, idx, len, listener, ref, size;
      dom = new DomBuilder();
      dom
        .tag("table")
        .tag("thead")
        .tag("tr")
        .tag("th")
        .rtag("dsort")
        .a("href", "#sort-dist")
        .text("Cluster No.")
        .end()
        .end()
        .tag("th")
        .rtag("ssort")
        .a("href", "#sort-size")
        .text("No. of Cells")
        .end()
        .end()
        .end()
        .end();
      dom.vars.ssort.addEventListener("click", (e) => {
        e.preventDefault();
        this.sortBySize();
        return this.updateClusterList();
      });
      dom.vars.dsort.addEventListener("click", (e) => {
        e.preventDefault();
        this.sortByDistance();
        return this.updateClusterList();
      });
      dom.tag("tbody");
      ref = this.clusters;
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        cluster = ref[idx];
        size = cluster.length;
        dist = cluster[0].len();
        dom
          .tag("tr")
          .tag("td")
          .rtag("navtag", "a")
          .a("href", `#nav-cluster${idx}`)
          .text(`${size}`)
          .end()
          .end()
          .tag("td")
          .rtag("navtag1", "a")
          .a("href", `#nav-cluster${idx}`)
          .text(`${ref.length - idx}`)
          .end()
          .end()
          .end();
        listener = this.makeNavigateTo(cluster[0]);
        dom.vars.navtag.addEventListener("click", listener);
        dom.vars.navtag1.addEventListener("click", listener);
      }
      dom.end();
      this.clustersElem.innerHTML = "";
      return this.clustersElem.appendChild(dom.finalize());
    }
  };
}).call(this);
