// Generated by CoffeeScript 2.7.0
(function () {
  var CenteredVonDyck,
    RewriteRuleset,
    VonDyck,
    knuthBendix,
    makeAppendRewrite,
    parseChain,
    unity,
    vdRule;

  ({ makeAppendRewrite, vdRule } = require("./vondyck_rewriter.js"));

  ({ parseChain, unity } = require("./vondyck_chain.js"));

  ({ RewriteRuleset, knuthBendix } = require("../core/knuth_bendix.js"));

  ({ CenteredVonDyck } = require("./triangle_group_representation.js"));

  //Top-level interface for vonDyck groups.
  exports.VonDyck = VonDyck = class VonDyck {
    constructor(n, m, k = 2) {
      this.n = n;
      this.m = m;
      this.k = k;
      if (this.n <= 0) {
        throw new Error("bad N");
      }
      if (this.m <= 0) {
        throw new Error("bad M");
      }
      if (this.k <= 0) {
        throw new Error("bad K");
      }
      this.unity = unity;
      //Matrix representation is only supported for hyperbolic groups at the moment.
      this.representation = function () {
        switch (this.type()) {
          case "hyperbolic":
            return new CenteredVonDyck(this.n, this.m, this.k);
          case "euclidean":
            return null;
          case "spheric":
            return null;
        }
      }.call(this);
    }

    //Return group type. One of "hyperbolic", "euclidean" or "spheric"
    type() {
      var den, num;
      //1/n+1/m+1/k  ?  1

      // (nm+nk+mk) ? nmk
      num = this.n * this.m + this.n * this.k + this.m * this.k;
      den = this.n * this.m * this.k;
      if (num < den) {
        return "hyperbolic";
      } else if (num === den) {
        return "euclidean";
      } else {
        return "spheric";
      }
    }

    toString() {
      return `VonDyck(${this.n}, ${this.m}, ${this.k})`;
    }

    parse(s) {
      return parseChain(s);
    }

    solve() {
      var rewriteRuleset;
      rewriteRuleset = knuthBendix(vdRule(this.n, this.m, this.k));
      return (this.appendRewrite = makeAppendRewrite(rewriteRuleset));
    }

    //console.log "Solved group #{@} OK"
    appendRewrite(chain, stack) {
      throw new Error("Group not solved");
    }

    rewrite(chain) {
      return this.appendRewrite(this.unity, chain.asStack());
    }

    repr(chain) {
      return chain.repr(this.representation);
    }

    inverse(chain) {
      return this.appendInverse(unity, chain);
    }

    // appends c^-1 to a
    appendInverse(a, c) {
      var e_p, elementsWithPowers, i, len;
      elementsWithPowers = c.asStack();
      elementsWithPowers.reverse();
      for (i = 0, len = elementsWithPowers.length; i < len; i++) {
        e_p = elementsWithPowers[i];
        e_p[1] *= -1;
      }
      return this.appendRewrite(a, elementsWithPowers);
    }

    append(c1, c2) {
      return this.appendRewrite(c1, c2.asStack());
    }
  };
}).call(this);