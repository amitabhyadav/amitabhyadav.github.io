/*
  Cosmic Genesis Modal System
  Provides simplified explanations for each epoch
*/

class CosmicModal {
  constructor() {
    this.modal = document.getElementById('infoModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalBody = document.getElementById('modalBody');
    this.modalClose = document.getElementById('modalClose');
    this.infoButtons = document.querySelectorAll('.info-btn');
    
    this.explanations = this.getExplanations();
    this.init();
  }

  init() {
    // Add click handlers to all info buttons
    this.infoButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const eraIndex = parseInt(btn.dataset.era);
        this.showModal(eraIndex);
      });
    });

    // Close modal handlers
    this.modalClose?.addEventListener('click', () => this.hideModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.hideModal();
      }
    });
  }

  showModal(eraIndex) {
    const explanation = this.explanations[eraIndex];
    if (!explanation) return;

    this.modalTitle.textContent = explanation.title;
    this.modalBody.innerHTML = this.formatExplanation(explanation);
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Re-render MathJax equations in the modal
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([this.modalBody]).catch((err) => {
        // MathJax typeset error handled silently
      });
    }
  }

  hideModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  formatExplanation(explanation) {
    return `
      <div class="modal-section">
        <h4>What happened?</h4>
        <p>${explanation.what}</p>
      </div>
      
      <div class="modal-section">
        <h4>In simple terms:</h4>
        <p>${explanation.simple}</p>
      </div>
      
      <div class="modal-section">
        <h4>Why is this important?</h4>
        <p>${explanation.importance}</p>
      </div>
      
      <div class="modal-section">
        <h4>What can we see today?</h4>
        <p>${explanation.evidence}</p>
      </div>
      
      ${explanation.analogy ? `
      <div class="modal-section analogy">
        <h4>Think of it like...</h4>
        <p>${explanation.analogy}</p>
      </div>
      ` : ''}
      
      ${explanation.scientific ? `
      <div class="modal-section scientific">
        <h4>Scientific Details:</h4>
        <p>${explanation.scientific}</p>
      </div>
      ` : ''}
      
      ${explanation.equations && explanation.equations.length > 0 ? `
      <div class="modal-section equations">
        <h4>Key Equations:</h4>
        ${explanation.equations.map(eq => `<div class="equation-item">${eq}</div>`).join('')}
      </div>
      ` : ''}
      
      ${explanation.scientists && explanation.scientists.length > 0 ? `
      <div class="modal-section scientists">
        <h4>Prominent Scientists:</h4>
        <ul>
          ${explanation.scientists.map(scientist => `<li><strong>${scientist.name}</strong> - ${scientist.contribution}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      <div class="modal-facts">
        <h4>Key Facts:</h4>
        <ul>
          ${explanation.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  getExplanations() {
    return {
      0: {
        title: "The Singularity - The Beginning of Everything",
        what: "At time zero, all of space, time, matter, and energy were compressed into a single point of infinite density and temperature. The laws of physics as we know them break down at this point.",
        simple: "Imagine trying to squeeze the entire universe into a space smaller than an atom. That's the singularity - a point where everything that exists was packed together so tightly that our normal understanding of physics stops working.",
        importance: "This marks the absolute beginning of our universe. Before this moment, the concepts of 'before', 'space', and 'time' don't even make sense. It's the starting point of everything we know.",
        evidence: "We can't directly observe the singularity, but we see its effects in the expansion of the universe and the cosmic microwave background radiation.",
        analogy: "Like a movie played in reverse where everything in the universe rushes back to a single point - except we can't see what happens at that final moment.",
        scientific: "The singularity represents a breakdown of Einstein's general relativity where spacetime curvature becomes infinite. Here, all four fundamental forces (electromagnetic, weak, strong, and gravitational) were unified into a single superforce. The Penrose-Hawking singularity theorems prove that such singularities must exist in general relativity under reasonable physical conditions. Quantum effects likely dominated, requiring a theory of quantum gravity that we don't yet possess.",
        equations: [
          "\\(R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}\\) (Einstein field equations fail)",
          "\\(\\rho \\to \\infty\\), \\(T \\to \\infty\\), \\(R \\to \\infty\\) (physical quantities diverge)"
        ],
        scientists: [
          {name: "Albert Einstein", contribution: "Developed general relativity (1915), initially resisted Big Bang theory"},
          {name: "Georges Lemaître", contribution: "First proposed the 'primeval atom' hypothesis (1927)"},
          {name: "Roger Penrose", contribution: "Penrose-Hawking singularity theorems (1965-1970)"},
          {name: "Stephen Hawking", contribution: "Singularity theorems and quantum effects near singularities"}
        ],
        facts: [
          "Temperature: Infinite",
          "Density: Infinite", 
          "Size: Zero",
          "Time doesn't exist yet",
          "All four fundamental forces were one",
          "Spacetime curvature: Infinite",
          "Planck density: 5.16 × 10⁹⁶ kg/m³"
        ]
      },
      
      1: {
        title: "Planck Epoch - The Quantum Universe",
        what: "In the first 10⁻⁴³ seconds, the universe was so hot and dense that quantum effects dominated gravity. Space and time themselves were 'foamy' and uncertain at the smallest scales.",
        simple: "The universe was so tiny and hot that the normal rules of space and time were constantly breaking and reforming. Imagine space itself bubbling like boiling water, but at scales trillions of times smaller than an atom.",
        importance: "This is the earliest moment we can theoretically describe using physics. It sets the initial conditions for everything that follows.",
        evidence: "While we can't directly observe this epoch, its effects shaped the large-scale structure of the universe we see today.",
        analogy: "Like looking at a photo that's so pixelated you can't make out any details - except the 'pixels' are space and time themselves.",
        scientific: "During the Planck epoch, quantum gravitational effects dominated, creating a 'spacetime foam' where the classical concepts of space and time break down. At the Planck scale, virtual black holes spontaneously form and evaporate, and spacetime becomes non-commutative. The four fundamental forces existed as a single unified superforce described by a hypothetical Theory of Everything. Quantum fluctuations in the geometry itself may have seeded the primordial density perturbations. The Planck temperature represents the energy scale where quantum gravity becomes significant, requiring theories like string theory or loop quantum gravity.",
        equations: [
          "\\(t_P = \\sqrt{\\frac{\\hbar G}{c^5}} = 5.39 \\times 10^{-44}\\) s (Planck time)",
          "\\(l_P = \\sqrt{\\frac{\\hbar G}{c^3}} = 1.62 \\times 10^{-35}\\) m (Planck length)",
          "\\(T_P = \\sqrt{\\frac{\\hbar c^5}{G k_B^2}} = 1.42 \\times 10^{32}\\) K (Planck temperature)",
          "\\(E_P = \\sqrt{\\frac{\\hbar c^5}{G}} = 1.22 \\times 10^{19}\\) GeV (Planck energy)"
        ],
        scientists: [
          {name: "Max Planck", contribution: "Introduced Planck units and quantum theory (1900)"},
          {name: "John Wheeler", contribution: "Coined 'spacetime foam' and quantum gravity concepts (1955)"},
          {name: "Edward Witten", contribution: "Advanced string theory as quantum gravity theory"},
          {name: "Carlo Rovelli", contribution: "Developed loop quantum gravity approach"},
          {name: "Abhay Ashtekar", contribution: "Pioneered loop quantum cosmology and Ashtekar variables"}
        ],
        facts: [
          "Duration: 0 to 10⁻⁴³ seconds",
          "Temperature: 10³² Kelvin (100 million trillion trillion degrees)",
          "Size: 10⁻³⁵ meters (Planck length)",
          "All forces unified into one superforce",
          "Quantum gravity rules everything"
        ]
      },

      2: {
        title: "Grand Unification - Gravity Breaks Away",
        what: "At 10⁻³⁶ seconds, the universe cooled enough for gravity to become a separate force, while the strong, weak, and electromagnetic forces remained unified.",
        simple: "Think of it like water freezing - as the universe cooled, the first 'phase transition' happened and gravity 'froze out' as its own force, different from the others.",
        importance: "This was the first major change in the fundamental nature of the universe. It set the stage for the different forces we experience today.",
        evidence: "Particle physics experiments at places like CERN try to recreate these conditions to understand how forces unify at high energies.",
        analogy: "Like a band where the drummer decides to go solo - gravity split off to do its own thing while the other three forces stayed together.",
        scientific: "At the Grand Unification scale (~10¹⁶ GeV), gravity separates from the electronuclear force through spontaneous symmetry breaking. Grand Unified Theories (GUTs) predict that at this energy, the strong and electroweak forces merge into a single interaction mediated by gauge bosons. The most popular models include SU(5), SO(10), and E₆ symmetry groups. X and Y bosons, with masses ~10¹⁶ GeV, would mediate transitions between quarks and leptons, potentially causing proton decay. This epoch involves non-Abelian gauge theories and the Higgs mechanism at the GUT scale.",
        equations: [
          "\\(M_{GUT} \\sim 2 \\times 10^{16}\\) GeV (GUT scale mass)",
          "\\(\\alpha_1 = \\alpha_2 = \\alpha_3\\) at \\(M_{GUT}\\) (coupling unification)",
          "\\(\\tau_p > 10^{34}\\) years (proton lifetime lower bound)",
          "\\(SU(5) \\rightarrow SU(3)_C \\times SU(2)_L \\times U(1)_Y\\) (symmetry breaking)"
        ],
        scientists: [
          {name: "Sheldon Glashow", contribution: "Pioneered Grand Unified Theory concepts and SU(5) model"},
          {name: "Howard Georgi", contribution: "Developed the first detailed GUT model with Glashow"},
          {name: "Abdus Salam", contribution: "Contributed to gauge theory unification principles"},
          {name: "Murray Gell-Mann", contribution: "Developed SU(3) color symmetry for strong force"},
          {name: "Frank Wilczek", contribution: "Advanced supersymmetric GUTs and asymptotic freedom"}
        ],
        facts: [
          "Time: 10⁻³⁶ seconds after Big Bang",
          "Temperature: 10²⁸ Kelvin",
          "Gravity becomes distinct",
          "X and Y bosons could exist",
          "Matter and antimatter nearly equal"
        ]
      },

      3: {
        title: "Baryogenesis - Why Matter Exists",
        what: "Between 10⁻³⁶ and 10⁻¹⁰ seconds, a tiny imbalance between matter and antimatter developed. For every billion antimatter particles, there were a billion and one matter particles.",
        simple: "Matter and antimatter were created in nearly equal amounts, but matter won by the tiniest margin. That tiny victory is why anything exists at all - including us!",
        importance: "Without this imbalance, all matter and antimatter would have annihilated each other, leaving only light. We owe our existence to this cosmic favoritism.",
        evidence: "We see almost no antimatter in the universe today, and laboratory experiments show slight differences in how matter and antimatter behave.",
        analogy: "Like a massive battle where two armies of a billion soldiers each fight, and only one soldier remains standing - and that survivor built everything we see.",
        scientific: "Baryogenesis requires three Sakharov conditions: baryon number violation, C and CP violation, and departure from thermal equilibrium. In GUT models, heavy X and Y bosons decay asymmetrically to quarks and leptons. The observed baryon asymmetry parameter η = (n_B - n_B̄)/n_γ ≈ 6 × 10⁻¹⁰ demands precise CP violation mechanisms. Electroweak baryogenesis and leptogenesis via heavy neutrino decay are leading scenarios. The CKM matrix provides some CP violation, but insufficient for observed asymmetry, suggesting new physics beyond the Standard Model.",
        equations: [
          "\\(\\eta = \\frac{n_B - n_{\\bar{B}}}{n_\\gamma} \\approx 6 \\times 10^{-10}\\) (baryon asymmetry)",
          "\\(\\Omega_b h^2 = 0.02233 \\pm 0.00015\\) (baryon density parameter)",
          "\\(J = \\text{Im}[V_{us}V_{cb}V_{ub}^*V_{cs}^*]\\) (Jarlskog invariant)",
          "\\(\\Gamma(X \\to q\\bar{l}) \\neq \\Gamma(\\bar{X} \\to \\bar{q}l)\\) (CP violation condition)"
        ],
        scientists: [
          {name: "Andrei Sakharov", contribution: "Formulated the three conditions for baryogenesis (1967)"},
          {name: "Makoto Kobayashi", contribution: "Discovered CP violation in neutral kaon system (1964)"},
          {name: "Toshihide Maskawa", contribution: "Developed CKM matrix theory of CP violation"},
          {name: "Vadim Kuzmin", contribution: "Advanced electroweak baryogenesis mechanisms"},
          {name: "Mikhail Shaposhnikov", contribution: "Pioneered leptogenesis and electroweak phase transition"}
        ],
        facts: [
          "Matter outnumbered antimatter by 1 part in a billion",
          "CP violation made the difference",
          "Sakharov conditions were met",
          "Temperature: 10²⁸ to 10¹⁶ Kelvin",
          "This excess became all the matter in the universe"
        ]
      },

      4: {
        title: "Cosmic Inflation - The Universe Explodes in Size",
        what: "Between 10⁻³² and 10⁻²⁸ seconds, the universe underwent exponential expansion, growing by a factor of at least 10²⁶ in size almost instantly.",
        simple: "The universe suddenly inflated like the world's fastest balloon, expanding faster than light and smoothing out any wrinkles. In less than a trillionth of a trillionth of a trillionth of a second, it grew from smaller than an atom to bigger than a grapefruit.",
        importance: "Inflation explains why the universe looks the same in all directions and why space is so flat. It also created the tiny ripples that became galaxies.",
        evidence: "The cosmic microwave background shows the universe is remarkably uniform with tiny fluctuations - exactly what inflation predicts.",
        analogy: "Like inflating a wrinkled balloon - as it expands rapidly, all the wrinkles smooth out and the surface becomes nearly perfectly smooth.",
        scientific: "Cosmic inflation is driven by a scalar field (inflaton) with potential energy dominating kinetic energy, creating negative pressure. The de Sitter expansion stretches quantum fluctuations beyond the Hubble horizon, freezing them as classical perturbations. Slow-roll inflation requires ε = (1/2)(V'/V)² << 1 and η = V''/V << 1. The power spectrum P(k) ∝ k^(n_s-1) with spectral index n_s ≈ 0.965. Inflation solves the horizon, flatness, and monopole problems while generating nearly scale-invariant primordial perturbations that seed cosmic structure.",
        equations: [
          "\\(a(t) = a_0 e^{Ht}\\) (exponential expansion during inflation)",
          "\\(H^2 = \\frac{8\\pi G}{3}V(\\phi)\\) (Friedmann equation with inflaton)",
          "\\(\\epsilon = \\frac{1}{2}\\left(\\frac{V'}{V}\\right)^2 << 1\\) (slow-roll parameter)",
          "\\(P_s(k) = \\frac{H^2}{8\\pi^2 \\epsilon}\\) (scalar power spectrum)"
        ],
        scientists: [
          {name: "Alan Guth", contribution: "Proposed cosmic inflation theory (1980)"},
          {name: "Andrei Linde", contribution: "Developed chaotic inflation and eternal inflation"},
          {name: "Paul Steinhardt", contribution: "Advanced new inflation and slow-roll conditions"},
          {name: "Andreas Albrecht", contribution: "Co-developed new inflation with Steinhardt"},
          {name: "Alexei Starobinsky", contribution: "Pioneered R² inflation and quantum fluctuations"}
        ],
        facts: [
          "Duration: 10⁻³² to 10⁻²⁸ seconds",
          "Expansion factor: at least 10²⁶",
          "Solved the horizon and flatness problems",
          "Created quantum fluctuations that became galaxies",
          "Space expanded faster than light"
        ]
      },

      5: {
        title: "Electroweak Breaking - Forces Split Again",
        what: "At 10⁻¹² seconds, the Higgs field gave mass to particles, causing the electromagnetic and weak forces to separate. The W and Z bosons became heavy while the photon remained massless.",
        simple: "The universe cooled enough for the Higgs field to 'switch on,' like honey thickening as it cools. This gave mass to particles and split the electroweak force into the electromagnetic and weak forces we know today.",
        importance: "This is why particles have mass and why we have distinct forces. Without it, electrons would be massless and atoms couldn't exist.",
        evidence: "The Large Hadron Collider discovered the Higgs boson in 2012, confirming this mechanism.",
        analogy: "Like a crowded dance floor suddenly filling with honey - some dancers (photons) can still move freely on top, while others (W and Z bosons) get stuck and move slowly.",
        scientific: "Electroweak symmetry breaking occurs when the Higgs field acquires a vacuum expectation value (VEV) of v = 246 GeV, spontaneously breaking SU(2)_L × U(1)_Y → U(1)_EM. The Higgs mechanism generates masses through Yukawa couplings: m_f = y_f v/√2. W and Z bosons acquire masses through gauge coupling to the Higgs field, while the photon remains massless as a linear combination of B and W³ that doesn't couple to the Higgs. The weak mixing angle θ_W relates electromagnetic and weak couplings: sin²θ_W ≈ 0.23. This phase transition is a crossover, not first-order.",
        equations: [
          "\\(v = \\langle\\phi\\rangle = 246\\) GeV (Higgs VEV)",
          "\\(m_W = \\frac{gv}{2} = 80.4\\) GeV (W boson mass)",
          "\\(m_Z = \\frac{\\sqrt{g^2 + g'^2}v}{2} = 91.2\\) GeV (Z boson mass)",
          "\\(m_f = \\frac{y_f v}{\\sqrt{2}}\\) (fermion masses via Yukawa coupling)",
          "\\(\\sin^2\\theta_W = \\frac{g'^2}{g^2 + g'^2} \\approx 0.23\\) (weak mixing angle)"
        ],
        scientists: [
          {name: "Peter Higgs", contribution: "Proposed the Higgs mechanism for mass generation (1964)"},
          {name: "François Englert", contribution: "Co-discovered the Higgs mechanism independently"},
          {name: "Robert Brout", contribution: "Collaborated with Englert on spontaneous symmetry breaking"},
          {name: "Steven Weinberg", contribution: "Developed electroweak theory and predicted W/Z masses"},
          {name: "Abdus Salam", contribution: "Independently developed electroweak unification"}
        ],
        facts: [
          "Time: 10⁻¹² seconds (one picosecond)",
          "Temperature: 10¹⁵ Kelvin (100 GeV)",
          "Higgs field value: 246 GeV",
          "W boson mass: 80.4 GeV/c²",
          "Z boson mass: 91.2 GeV/c²"
        ]
      },

      6: {
        title: "Quark Confinement - Building Blocks Form",
        what: "At one microsecond, the universe cooled below 10¹² Kelvin, causing free quarks and gluons to become confined into protons and neutrons.",
        simple: "Quarks that were swimming freely in a hot soup suddenly got locked up in groups of three to make protons and neutrons - the building blocks of atoms. They've been imprisoned ever since!",
        importance: "This created the protons and neutrons that make up all atomic matter. Without confinement, atoms and chemistry would be impossible.",
        evidence: "Heavy-ion collisions at RHIC and LHC recreate the quark-gluon plasma, showing us what the universe was like before confinement.",
        analogy: "Like water vapor condensing into droplets - except the 'droplets' are protons and neutrons, and the 'vapor' was free quarks.",
        scientific: "The QCD phase transition from quark-gluon plasma to hadron gas occurs at the critical temperature T_c ≈ 150-170 MeV. Above T_c, quarks and gluons are deconfined due to asymptotic freedom (β-function < 0). Below T_c, color confinement emerges from the non-Abelian nature of QCD, where gluon self-interactions create a linear potential V(r) ∝ r between quarks. Chiral symmetry is also spontaneously broken, generating constituent quark masses through the QCD vacuum condensate ⟨q̄q⟩ ≠ 0. Lattice QCD calculations confirm this crossover transition.",
        equations: [
          "\\(\\Lambda_{QCD} \\approx 200\\) MeV (QCD scale parameter)",
          "\\(\\alpha_s(\\mu^2) = \\frac{12\\pi}{(33-2n_f)\\ln(\\mu^2/\\Lambda_{QCD}^2)}\\) (running coupling)",
          "\\(V(r) = -\\frac{4\\alpha_s}{3r} + \\sigma r\\) (Cornell potential)",
          "\\(\\langle\\bar{q}q\\rangle \\approx -(250 \\text{ MeV})^3\\) (chiral condensate)"
        ],
        scientists: [
          {name: "Murray Gell-Mann", contribution: "Proposed quarks and developed SU(3) color symmetry"},
          {name: "David Gross", contribution: "Discovered asymptotic freedom in QCD (1973)"},
          {name: "Frank Wilczek", contribution: "Co-discovered asymptotic freedom and coined 'QCD'"},
          {name: "David Politzer", contribution: "Co-discovered asymptotic freedom independently"},
          {name: "Kenneth Wilson", contribution: "Developed lattice QCD for non-perturbative calculations"}
        ],
        facts: [
          "Time: 10⁻⁶ seconds (one microsecond)",
          "Temperature: 10¹² Kelvin (150 MeV)",
          "Proton mass: 938.3 MeV/c²",
          "Neutron mass: 939.6 MeV/c²",
          "Strong force becomes short-range"
        ]
      },

      7: {
        title: "Neutrino Decoupling - Ghost Particles Go Free",
        what: "At about 1 second, neutrinos stopped interacting with other matter and began streaming freely through the universe, forming the cosmic neutrino background.",
        simple: "Neutrinos - tiny, nearly massless particles - stopped bumping into other particles and started flying freely through space. They're still flying around us right now, billions passing through your body every second!",
        importance: "These neutrinos carry information about the universe when it was only one second old. They're like messengers from nearly the beginning of time.",
        evidence: "While we haven't detected the cosmic neutrino background directly, we see neutrinos from the Sun and supernovae, proving they stream freely through space.",
        analogy: "Like ghosts leaving a crowded party - they slip through the walls and have been wandering the universe ever since.",
        scientific: "Neutrino decoupling occurs when the weak interaction rate Γ_ν = G_F²T⁵ drops below the Hubble expansion rate H = 1.66g*^(1/2)T²/M_Pl. At T ≈ 1 MeV, neutrinos become non-relativistic and decouple from the thermal bath. They maintain a Fermi-Dirac distribution with temperature T_ν = (4/11)^(1/3)T_γ due to entropy transfer during e⁺e⁻ annihilation. The cosmic neutrino background has a current temperature of 1.945 K and contributes Ω_ν h² ≈ Σm_ν/(93.14 eV) to the energy density.",
        equations: [
          "\\(\\Gamma_\\nu = G_F^2 T^5\\) (neutrino interaction rate)",
          "\\(T_\\nu = \\left(\\frac{4}{11}\\right)^{1/3} T_\\gamma = 1.945\\) K (neutrino temperature today)",
          "\\(n_\\nu = \\frac{3}{11} n_\\gamma \\approx 112 \\text{ cm}^{-3}\\) (neutrino number density)",
          "\\(\\Omega_\\nu h^2 = \\frac{\\sum m_\\nu}{93.14 \\text{ eV}}\\) (neutrino density parameter)"
        ],
        scientists: [
          {name: "Wolfgang Pauli", contribution: "Proposed the neutrino to save energy conservation (1930)"},
          {name: "Enrico Fermi", contribution: "Developed weak interaction theory and named 'neutrino'"},
          {name: "Frederick Reines", contribution: "First detected neutrinos experimentally (1956)"},
          {name: "Clyde Cowan", contribution: "Co-discovered neutrinos with Reines using reactor"},
          {name: "John Bahcall", contribution: "Predicted solar neutrino flux and solved neutrino problem"}
        ],
        facts: [
          "Time: ~1 second",
          "Temperature: 10¹⁰ Kelvin (1 MeV)",
          "Present temperature: 1.95 Kelvin",
          "Density today: 112 neutrinos/cm³ per type",
          "Three types: electron, muon, tau neutrinos"
        ]
      },

      8: {
        title: "Big Bang Nucleosynthesis - Cooking Up Elements",
        what: "Between 1 second and 20 minutes, protons and neutrons fused to create the first atomic nuclei: hydrogen, helium, and traces of lithium and beryllium.",
        simple: "The entire universe became a giant nuclear reactor, fusing protons and neutrons into the first simple elements. In just 20 minutes, it cooked up all the hydrogen and helium that would later form stars.",
        importance: "This created 75% hydrogen and 25% helium by mass - the raw materials for the first stars. The precise amounts match our observations perfectly.",
        evidence: "We measure these exact proportions in the oldest, most pristine gas clouds in the universe.",
        analogy: "Like a cosmic kitchen that was only open for 20 minutes but managed to prepare all the basic ingredients needed for the rest of cosmic history.",
        scientific: "BBN begins when the universe cools below the deuterium binding energy (2.22 MeV) at T ≈ 0.1 MeV. The neutron-to-proton ratio freezes at n/p ≈ 1/7 due to neutron decay (τ_n = 880s). Nuclear reaction chains proceed: ¹H(n,γ)²H, ²H(p,γ)³He, ²H(d,n)³He, ³He(d,p)⁴He, ³He(α,γ)⁷Be. The final abundances depend critically on the baryon-to-photon ratio η = n_b/n_γ ≈ 6×10⁻¹⁰. No stable mass-5 or mass-8 nuclei exist, creating a bottleneck that prevents heavier element formation.",
        equations: [
          "\\(Y_p = \\frac{2(n/p)}{1 + (n/p)} \\approx 0.25\\) (helium-4 mass fraction)",
          "\\(\\frac{n}{p} = e^{-Q/T}\\) where \\(Q = 1.293\\) MeV (neutron-proton mass difference)",
          "\\(\\eta = \\frac{n_B}{n_\\gamma} = \\frac{\\Omega_b h^2}{3.65 \\times 10^{-3}}\\) (baryon-to-photon ratio)",
          "\\([\\text{D}/\\text{H}] \\propto \\eta^{-1.6}\\) (deuterium abundance scaling)"
        ],
        scientists: [
          {name: "George Gamow", contribution: "Predicted BBN and hot Big Bang model (1946)"},
          {name: "Ralph Alpher", contribution: "Calculated primordial abundances in αβγ paper (1948)"},
          {name: "Robert Herman", contribution: "Co-developed BBN theory and predicted CMB temperature"},
          {name: "Fred Hoyle", contribution: "Refined helium abundance calculations despite steady-state preference"},
          {name: "William Fowler", contribution: "Advanced nuclear astrophysics and BBN reaction rates"}
        ],
        facts: [
          "Duration: 1 second to 20 minutes",
          "Temperature: 10⁹ to 10⁸ Kelvin",
          "Products: 75% hydrogen, 25% helium",
          "Trace amounts: deuterium, lithium-7",
          "Neutron half-life: 880 seconds"
        ]
      },

      9: {
        title: "Matter-Radiation Equality - Matter Takes Control",
        what: "At 50,000 years, the density of matter equaled the density of radiation. After this point, matter's gravity dominated the universe's evolution.",
        simple: "For 50,000 years, light and radiation were the bullies, pushing matter around. But matter kept growing stronger, and finally took control. From this point on, gravity from matter shaped how the universe evolved.",
        importance: "This transition allowed gravity to start pulling matter together, beginning the process that would create stars and galaxies.",
        evidence: "The cosmic microwave background shows features from this transition, and the large-scale structure of galaxies began forming after this time.",
        analogy: "Like a seesaw where radiation and matter balanced perfectly for a moment before matter's side sank down to take control.",
        scientific: "Matter-radiation equality occurs when ρ_m = ρ_r, marking the transition from radiation-dominated to matter-dominated cosmology. Before equality, pressure gradients from radiation inhibited gravitational collapse. After equality, matter perturbations could grow as δ ∝ a(t) in the matter era. The equality redshift z_eq ≈ 3400 corresponds to T ≈ 9000 K. Dark matter dominated over baryons by Ω_dm/Ω_b ≈ 5.3, allowing structure formation to proceed despite radiation pressure affecting baryons. This epoch set the initial conditions for the cosmic web formation.",
        equations: [
          "\\(\\rho_m = \\rho_r\\) at \\(z_{eq} \\approx 3400\\) (equality condition)",
          "\\(a_{eq} = \\frac{\\Omega_r}{\\Omega_m}\\) (scale factor at equality)",
          "\\(\\delta(a) \\propto a\\) for \\(a > a_{eq}\\) (matter era growth)",
          "\\(k_{eq} = \\frac{a_{eq} H_{eq}}{c} \\approx 0.073 \\Omega_m h^2 \\text{ Mpc}^{-1}\\) (equality scale)"
        ],
        scientists: [
          {name: "Yakov Zeldovich", contribution: "Developed theory of structure formation and Zeldovich approximation"},
          {name: "James Peebles", contribution: "Pioneered physical cosmology and matter power spectrum theory"},
          {name: "William Press", contribution: "Developed Press-Schechter formalism for halo formation"},
          {name: "Simon White", contribution: "Advanced N-body simulations of structure formation"},
          {name: "Joseph Silk", contribution: "Studied Silk damping and small-scale structure suppression"}
        ],
        facts: [
          "Time: 50,000 years (5 × 10⁴ years)",
          "Temperature: 9,000 Kelvin",
          "Redshift: z ≈ 3,400",
          "Matter density = Radiation density",
          "Structure formation could begin"
        ]
      },

      10: {
        title: "Recombination - The Universe Becomes Transparent",
        what: "At 380,000 years, electrons combined with nuclei to form the first neutral atoms. Light could finally travel freely, creating the cosmic microwave background.",
        simple: "The universe had been like a thick fog where light couldn't travel far. Then electrons paired up with nuclei to make atoms, the fog cleared, and light could finally stream across the universe. We still see that first light today!",
        importance: "This created the cosmic microwave background - the oldest light we can see. It's like a baby photo of the universe.",
        evidence: "The cosmic microwave background radiation, discovered in 1964, shows us the universe exactly as it looked at this moment.",
        analogy: "Like a foggy morning suddenly clearing - except the 'fog' was free electrons, and when it cleared, the universe became transparent for the first time.",
        scientific: "Recombination occurs when the universe cools below the hydrogen ionization energy (13.6 eV) at T ≈ 3000 K. The Saha equation governs the ionization fraction: X_e = n_e/(n_e + n_H). The process is actually slow due to the photon-to-baryon ratio η ≈ 6×10⁻¹⁰, requiring multiple recombinations per hydrogen atom. The CMB photons we observe today were last scattered at the photosphere (z ≈ 1090) and have been redshifted from T ≈ 3000 K to T_0 = 2.725 K. Silk damping erases fluctuations on scales smaller than the photon diffusion length.",
        equations: [
          "\\(X_e = \\frac{n_e}{n_e + n_H}\\) (ionization fraction)",
          "\\(\\frac{X_e^2}{1-X_e} = \\frac{1}{n_b}\\left(\\frac{m_e T}{2\\pi}\\right)^{3/2} e^{-B/T}\\) (Saha equation)",
          "\\(T_0 = T_{rec}/(1+z_{rec}) = 3000/(1+1090) = 2.75\\) K (CMB temperature)",
          "\\(\\tau = \\int n_e \\sigma_T c dt\\) (Thomson optical depth)"
        ],
        scientists: [
          {name: "Arno Penzias", contribution: "Discovered cosmic microwave background radiation (1964)"},
          {name: "Robert Wilson", contribution: "Co-discovered CMB with Penzias, confirming hot Big Bang"},
          {name: "George Gamow", contribution: "Predicted hot relic radiation from Big Bang nucleosynthesis"},
          {name: "Ralph Alpher", contribution: "Calculated recombination epoch and CMB properties"},
          {name: "Joseph Silk", contribution: "Discovered Silk damping of small-scale CMB anisotropies"}
        ],
        facts: [
          "Time: 380,000 years",
          "Temperature: 3,000 Kelvin",
          "Redshift: z = 1,090",
          "CMB temperature today: 2.725 K",
          "Universe became transparent to light"
        ]
      },

      11: {
        title: "The Dark Ages - Waiting for Light",
        what: "From 380,000 years to 200 million years, the universe was dark. No stars existed yet, only neutral hydrogen gas slowly collapsing under gravity.",
        simple: "After the universe became transparent, it was like a dark room with no light bulbs. Gravity slowly pulled gas into clumps, preparing the stage for the first stars, but for millions of years, the universe waited in darkness.",
        importance: "This quiet period allowed gravity to do its work, creating the seeds of the first stars and galaxies.",
        evidence: "Radio telescopes are trying to detect signals from neutral hydrogen during this period.",
        analogy: "Like a dark theater where the audience (gas and dark matter) is slowly taking their seats, waiting for the show (first stars) to begin.",
        scientific: "The Dark Ages span from recombination (z ≈ 1100) to reionization (z ≈ 20-6). During this epoch, the universe contained only neutral hydrogen and helium with no sources of light except the cooling CMB. Dark matter halos grew hierarchically via gravitational instability, following the Press-Schechter formalism. The baryon gas cooled adiabatically as T ∝ (1+z)² and began collecting in dark matter potential wells. The 21-cm hyperfine transition of neutral hydrogen provides the only observational probe of this epoch, detectable as absorption against the CMB.",
        equations: [
          "\\(T_{gas} = T_{CMB}(1+z)^2/(1+z_{eq})\\) for \\(z < z_{eq}\\) (adiabatic cooling)",
          "\\(T_{21} = \\frac{T_s - T_{CMB}}{1 + T_{CMB}/T_s} \\times \\frac{T_s}{T_{CMB}}\\) (21-cm brightness temperature)",
          "\\(\\nu_{21} = 1420.4\\) MHz (21-cm rest frequency)",
          "\\(M_{Jeans} = \\frac{5k_BT}{3G\\mu m_H}\\left(\\frac{\\pi}{6\\rho}\\right)^{1/2}\\) (Jeans mass for collapse)"
        ],
        scientists: [
          {name: "Martin Rees", contribution: "Studied early structure formation and first star formation"},
          {name: "Abraham Loeb", contribution: "Advanced theoretical understanding of cosmic dawn and 21-cm cosmology"},
          {name: "Rennan Barkana", contribution: "Developed 21-cm signal predictions and early universe physics"},
          {name: "Steven Furlanetto", contribution: "Modeled reionization and 21-cm tomography of cosmic dawn"},
          {name: "Benedetta Ciardi", contribution: "Simulated early galaxy formation and reionization processes"}
        ],
        facts: [
          "Duration: 380,000 to 200 million years",
          "No sources of light except CMB",
          "Temperature dropped from 3,000 K to 60 K",
          "Dark matter halos grew",
          "First star-forming regions developed"
        ]
      },

      12: {
        title: "First Stars - Let There Be Light!",
        what: "Around 200 million years after the Big Bang, the first stars ignited. These massive stars, made only of hydrogen and helium, blazed brilliantly but lived short lives.",
        simple: "The universe finally got its first light bulbs! These first stars were monsters - hundreds of times more massive than our Sun, blazing blue-white and living fast before exploding as supernovae.",
        importance: "These stars created the first heavy elements and began the process of reionizing the universe. They were the ancestors of all later stars.",
        evidence: "We haven't seen these stars directly, but we see their effects in the chemical composition of the oldest known stars.",
        analogy: "Like the first fireworks in a dark sky - brilliant, short-lived, but lighting the fuse for all the displays to come.",
        scientific: "Population III stars formed in primordial gas clouds with zero metallicity, collapsing in dark matter minihalos of ~10⁶ M☉. Without metals to provide cooling, the Jeans mass was much higher (~100-1000 M☉), leading to very massive stars. Nuclear burning proceeded through the pp-chain and CNO cycle using trace lithium. These stars had surface temperatures >50,000 K and luminosities >10⁶ L☉. Core-collapse supernovae with E >10⁵² erg enriched the IGM with metals, enabling lower-mass star formation and triggering reionization through ionizing photons.",
        equations: [
          "\\(M_{Jeans} \\propto T^{3/2}\\rho^{-1/2}\\) (Jeans mass for primordial gas)",
          "\\(t_{MS} \\approx 10^{10}\\left(\\frac{M}{M_\\odot}\\right)^{-2.5}\\) years (main sequence lifetime)",
          "\\(L \\propto M^{3.5}\\) (mass-luminosity relation for massive stars)",
          "\\(\\dot{N}_{ion} \\approx 10^{48}\\left(\\frac{M}{100M_\\odot}\\right)^2\\) s⁻¹ (ionizing photon rate)"
        ],
        scientists: [
          {name: "Tom Abel", contribution: "First 3D simulations of primordial star formation"},
          {name: "Volker Bromm", contribution: "Pioneered Population III star formation theory"},
          {name: "Naoki Yoshida", contribution: "Advanced high-resolution simulations of first stars"},
          {name: "Simon Glover", contribution: "Detailed chemical models of primordial star formation"},
          {name: "Ralf Klessen", contribution: "Studied feedback from first stars and supernovae"}
        ],
        facts: [
          "Time: ~200 million years",
          "Mass: 100-300 times our Sun",
          "Lifetime: only 2-3 million years",
          "No metals (only H and He)",
          "Ended as supernovae or black holes"
        ]
      },

      13: {
        title: "Reionization - The Universe Lights Up Again",
        what: "From 400 million to 1 billion years, ultraviolet light from the first stars and galaxies reionized the neutral hydrogen, making the universe transparent to UV light.",
        simple: "The first stars and galaxies acted like cosmic bug zappers, their UV light stripping electrons from hydrogen atoms again. The universe went from neutral to ionized, like turning on blacklights in a dark room.",
        importance: "This ended the cosmic dark ages permanently and allowed us to see distant galaxies. It shaped how galaxies could form and grow.",
        evidence: "We see the effects in quasar spectra and the cosmic microwave background. The most distant galaxies show us reionization in action.",
        analogy: "Like dawn breaking after a long night, but taking 600 million years - ionized bubbles grew around galaxies until they filled all of space.",
        scientific: "Reionization occurs when ionizing photons (hν > 13.6 eV) from stars and AGN overcome recombinations in the IGM. The process creates H II regions that expand and overlap. The ionization balance is governed by ṅ_ion = ṅ_rec, where the recombination rate scales as α_B n_H n_e. The Thomson scattering optical depth τ_e provides observational constraints from CMB polarization. Patchy reionization creates 21-cm fluctuations observable with radio telescopes. The escape fraction f_esc of ionizing photons from galaxies is crucial for reionization efficiency.",
        equations: [
          "\\(\\dot{n}_{ion} = f_{esc} \\xi_{ion} \\rho_{SFR}\\) (ionizing photon production rate)",
          "\\(\\dot{n}_{rec} = \\alpha_B n_H n_e C_{HII}\\) (recombination rate with clumping)",
          "\\(\\tau_e = \\int_0^{z_{reion}} \\sigma_T n_e(z) \\frac{c dt}{dz} dz\\) (Thomson optical depth)",
          "\\(\\xi_{ion} = \\frac{N_{ion}}{\\rho_{UV}}\\) (ionizing efficiency per UV luminosity)"
        ],
        scientists: [
          {name: "James Gunn", contribution: "Predicted Gunn-Peterson effect in quasar spectra (1965)"},
          {name: "Bruce Peterson", contribution: "Co-developed Gunn-Peterson test for neutral hydrogen"},
          {name: "Avi Loeb", contribution: "Advanced theoretical models of reionization topology"},
          {name: "Rennan Barkana", contribution: "Developed 21-cm signatures of reionization"},
          {name: "Andrea Ferrara", contribution: "Modeled galaxy formation during reionization epoch"}
        ],
        facts: [
          "Duration: 400 million to 1 billion years",
          "Driven by UV from stars and galaxies",
          "Reionization redshift: z ≈ 7.7",
          "Made universe transparent to UV",
          "Ended the cosmic dark ages"
        ]
      },

      14: {
        title: "Galaxy Formation - Cities of Stars",
        what: "From 500 million years onward, gas collected in dark matter halos to form the first galaxies - collections of billions of stars, gas, and dust.",
        simple: "Gravity pulled gas and stars together into the first galaxies - cosmic cities where stars are born, live, and die. These galaxies would grow, merge, and evolve into the beautiful spirals and ellipticals we see today.",
        importance: "Galaxies became the factories for making stars and heavy elements. They're where all the interesting chemistry and biology would eventually happen.",
        evidence: "The Hubble and James Webb Space Telescopes show us galaxies forming when the universe was less than a billion years old.",
        analogy: "Like villages growing into cities - small collections of stars merged and grew into the massive galaxy metropolises we see today.",
        scientific: "Galaxy formation follows hierarchical clustering in ΛCDM cosmology, where small halos merge to form larger structures. Baryons cool via atomic transitions (H, He) and molecular cooling (H₂, HD) in dark matter potential wells. The virial temperature T_vir = μ m_H v_c²/(2k_B) determines cooling efficiency. Star formation follows the Kennicutt-Schmidt law: Σ_SFR ∝ Σ_gas^n with n ≈ 1.4. Feedback from supernovae and AGN regulates star formation through momentum-driven winds and heating. Galaxy morphology depends on merger history and angular momentum conservation.",
        equations: [
          "\\(M_{halo} = \\frac{4\\pi}{3}\\rho_c \\Delta_c r_{vir}^3\\) (virial mass relation)",
          "\\(t_{cool} = \\frac{3k_B T}{2n\\Lambda(T)}\\) (cooling time)",
          "\\(\\Sigma_{SFR} = A\\left(\\frac{\\Sigma_{gas}}{M_\\odot \\text{pc}^{-2}}\\right)^{1.4}\\) (Kennicutt-Schmidt law)",
          "\\(j = \\lambda \\sqrt{2} v_c r_{vir}\\) (specific angular momentum)"
        ],
        scientists: [
          {name: "Simon White", contribution: "Pioneered galaxy formation simulations and merger trees"},
          {name: "Carlos Frenk", contribution: "Advanced cold dark matter galaxy formation theory"},
          {name: "Julio Navarro", contribution: "Discovered NFW density profile for dark matter halos"},
          {name: "Avishai Dekel", contribution: "Studied galaxy formation and cold flow accretion"},
          {name: "Lars Hernquist", contribution: "Developed galaxy merger simulations and stellar feedback"}
        ],
        facts: [
          "First galaxies: 500 million years",
          "Mass: 10⁸ to 10¹⁰ solar masses",
          "Dark matter halos: 10¹¹ to 10¹² solar masses",
          "Star formation rate increased rapidly",
          "Galaxies began merging and growing"
        ]
      },

      15: {
        title: "Supermassive Black Holes - Gravity's Monsters",
        what: "By 1 billion years, supermassive black holes millions to billions of times the Sun's mass had formed at galaxy centers, powering bright quasars.",
        simple: "At the heart of galaxies, matter fell into gravitational traps so deep that not even light could escape. These monster black holes grew by eating gas and stars, sometimes shining as quasars brighter than entire galaxies.",
        importance: "These black holes helped regulate galaxy growth and powered the brightest objects in the universe. Nearly every large galaxy has one at its center.",
        evidence: "We see quasars powered by billion-solar-mass black holes when the universe was less than a billion years old.",
        analogy: "Like cosmic drains at the center of galactic whirlpools - except what goes down never comes back, and the friction makes them glow brilliantly.",
        scientific: "Supermassive black holes (SMBHs) form through direct collapse of primordial gas clouds, intermediate mass black hole mergers, or growth from Population III remnants. Accretion follows the Eddington limit: L_Edd = 4π GM m_p c/σ_T. The Schwarzschild radius r_s = 2GM/c² defines the event horizon. Accretion disks reach temperatures ~10⁷ K, emitting thermal radiation. Relativistic jets launched via the Blandford-Znajek mechanism extract rotational energy. The M-σ relation connects SMBH mass to bulge velocity dispersion, indicating co-evolution with host galaxies.",
        equations: [
          "\\(r_s = \\frac{2GM}{c^2} = 3.0\\left(\\frac{M}{M_\\odot}\\right)\\) km (Schwarzschild radius)",
          "\\(L_{Edd} = \\frac{4\\pi GMm_p c}{\\sigma_T} = 1.3 \\times 10^{38}\\left(\\frac{M}{M_\\odot}\\right)\\) erg/s (Eddington luminosity)",
          "\\(M_{BH} = 10^8 M_\\odot \\left(\\frac{\\sigma}{200 \\text{ km/s}}\\right)^4\\) (M-σ relation)",
          "\\(\\dot{M} = \\frac{L}{\\eta c^2}\\) where \\(\\eta \\approx 0.1\\) (accretion rate from luminosity)"
        ],
        scientists: [
          {name: "Karl Schwarzschild", contribution: "Derived exact solution to Einstein equations for black holes (1916)"},
          {name: "Roy Kerr", contribution: "Found rotating black hole solution (1963)"},
          {name: "Roger Blandford", contribution: "Developed jet launching mechanism and accretion disk theory"},
          {name: "Maarten Schmidt", contribution: "Discovered first quasar 3C 273 and established distance scale (1963)"},
          {name: "Andrea Ghez", contribution: "Measured Sagittarius A* mass via stellar orbital dynamics"}
        ],
        facts: [
          "Mass: millions to billions of suns",
          "Found in most galaxy centers",
          "Power the brightest quasars",
          "Event horizon: point of no return",
          "Can outshine entire galaxies"
        ]
      },

      16: {
        title: "Structure Formation - The Cosmic Web",
        what: "From 1 billion years to today, matter organized into the cosmic web - galaxies along filaments, separated by vast voids, with clusters at the intersections.",
        simple: "Gravity sculpted the universe into a vast web, like soap bubbles. Galaxies line up along invisible dark matter highways, leaving huge empty spaces between them. It's the largest structure in the universe!",
        importance: "This cosmic web is how matter organized itself on the largest scales. It determines where galaxies form and how they're distributed.",
        evidence: "Galaxy surveys like the Sloan Digital Sky Survey have mapped millions of galaxies, revealing the cosmic web structure.",
        analogy: "Like a 3D spider web made of galaxies, or the foam in your coffee - dense filaments surrounding mostly empty bubbles.",
        scientific: "The cosmic web emerges from gravitational collapse of dark matter following the Zeldovich approximation. Overdense regions collapse first along one axis (pancakes), then two axes (filaments), finally three axes (nodes/clusters). The mass function of halos follows Press-Schechter theory: dn/dM ∝ M⁻² exp(-δ_c²/2σ²). Cosmic voids expand due to underdensity, reaching δ ≈ -0.9. Galaxy bias b relates galaxy overdensity to matter: δ_g = bδ_m. The two-point correlation function ξ(r) ∝ r⁻γ with γ ≈ 1.8 quantifies clustering.",
        equations: [
          "\\(\\xi(r) = \\left(\\frac{r}{r_0}\\right)^{-\\gamma}\\) with \\(r_0 \\approx 5\\) Mpc (galaxy correlation function)",
          "\\(\\frac{dn}{dM} = \\frac{\\rho_0}{M}\\frac{d\\ln\\sigma^{-1}}{d\\ln M}f(\\sigma)\\) (Press-Schechter mass function)",
          "\\(\\delta_c = 1.686\\) (critical overdensity for spherical collapse)",
          "\\(P(k) = 4\\pi k^2 |\\delta_k|^2\\) (matter power spectrum)"
        ],
        scientists: [
          {name: "Yakov Zeldovich", contribution: "Developed pancake theory and Zeldovich approximation (1970)"},
          {name: "William Press", contribution: "Formulated Press-Schechter halo mass function"},
          {name: "Paul Schechter", contribution: "Co-developed Press-Schechter formalism for structure formation"},
          {name: "Adrian Melott", contribution: "Advanced understanding of cosmic web topology"},
          {name: "Jaan Einasto", contribution: "Discovered superclusters and cosmic web structure"}
        ],
        facts: [
          "Filaments: hundreds of millions of light-years long",
          "Voids: typically 100-200 million light-years across",
          "Clusters: up to 1,000 galaxies",
          "70% of galaxies live in filaments",
          "Largest structures in the universe"
        ]
      },

      17: {
        title: "Solar System Formation - Our Cosmic Home",
        what: "4.6 billion years ago, a cloud of gas and dust collapsed to form our Sun and planets. Rocky planets formed close in, gas giants farther out.",
        simple: "A cloud of gas and dust, enriched with elements from earlier star deaths, collapsed to form our Sun. Leftover material formed a disk that clumped into planets - our Earth among them. Our cosmic address was established!",
        importance: "This created the conditions for life on Earth. The right distance from the Sun, the right size, with water and an atmosphere.",
        evidence: "Meteorites, Moon rocks, and asteroid samples show us the age and composition of the early solar system.",
        analogy: "Like a figure skater pulling in their arms and spinning faster - the cloud collapsed, spun up, and flattened into a disk where planets could form.",
        scientific: "Solar system formation follows the nebular hypothesis: a molecular cloud core collapses under gravity, conserving angular momentum to form a protoplanetary disk. The minimum mass solar nebula (MMSN) had surface density Σ ∝ r⁻³/². Inside the snow line (~2.7 AU), only rocky materials condensed; beyond it, ices enabled giant planet formation. Planetary migration via disk-planet interactions explains current orbits. The Nice model describes outer planet migration triggering the Late Heavy Bombardment. Radiometric dating of meteorites gives t_0 = 4.567 Ga for solar system formation.",
        equations: [
          "\\(\\Sigma(r) = \\Sigma_0 \\left(\\frac{r}{1 \\text{ AU}}\\right)^{-3/2}\\) (surface density profile)",
          "\\(r_{snow} = \\sqrt{\\frac{L_*}{16\\pi\\sigma T_{ice}^4}}\\) (snow line location)",
          "\\(t_{acc} = \\frac{M_p}{\\dot{M}_p}\\) (accretion timescale)",
          "\\(M_{iso} = 2\\pi r^2 \\Sigma(r) \\Delta r\\) (isolation mass for planetesimals)"
        ],
        scientists: [
          {name: "Pierre-Simon Laplace", contribution: "Formulated nebular hypothesis for solar system formation (1796)"},
          {name: "Viktor Safronov", contribution: "Developed modern planetesimal accretion theory (1969)"},
          {name: "George Wetherill", contribution: "Advanced understanding of terrestrial planet formation"},
          {name: "Harold Urey", contribution: "Studied meteorite compositions and early solar system conditions"},
          {name: "Alan Boss", contribution: "Modeled protoplanetary disk evolution and planet formation"}
        ],
        facts: [
          "Age: 4.6 billion years",
          "Sun contains 99.86% of system's mass",
          "Formed from earlier star's remains",
          "Rocky planets inside, gas giants outside",
          "Earth formed in the habitable zone"
        ]
      },

      18: {
        title: "Present Day - The Universe Now",
        what: "Today, 13.8 billion years after the Big Bang, the universe contains billions of galaxies in a vast cosmic web, and it's accelerating in its expansion.",
        simple: "Here we are! The universe has cooled to just 2.7 degrees above absolute zero, filled with galaxies, stars, planets, and at least one planet with life wondering about it all. And mysteriously, the expansion is speeding up!",
        importance: "This is our cosmic moment - the universe is old enough for complex life but young enough that stars still shine. We live in a special time.",
        evidence: "Everything we see! From the cosmic microwave background to distant galaxies to the elements in our bodies.",
        analogy: "We're like archaeologists who've arrived at the perfect time - old enough to see the ancient ruins (CMB) but while the civilization (stars) is still active.",
        scientific: "The present universe is described by the ΛCDM concordance model with Ω_Λ = 0.685 (dark energy), Ω_m = 0.315 (matter), Ω_b = 0.049 (baryons). The Hubble constant H_0 = 67.4 km/s/Mpc indicates current expansion rate. Dark energy, modeled as a cosmological constant, drives accelerating expansion with equation of state w = -1. The universe is geometrically flat (Ω_k = 0) and contains ~2 trillion galaxies within the observable horizon. The current cosmic microwave background temperature is T_CMB = 2.725 K, and the age is t_0 = 13.8 Ga.",
        equations: [
          "\\(H_0 = 67.4 \\pm 0.5\\) km/s/Mpc (Hubble constant)",
          "\\(\\Omega_\\Lambda + \\Omega_m + \\Omega_k = 1\\) (flatness condition)",
          "\\(q_0 = \\frac{\\Omega_m}{2} - \\Omega_\\Lambda \\approx -0.53\\) (deceleration parameter)",
          "\\(t_0 = \\int_0^{\\infty} \\frac{da}{a H(a)} = 13.8\\) Ga (age of universe)"
        ],
        scientists: [
          {name: "Edwin Hubble", contribution: "Discovered cosmic expansion and established Hubble's law (1929)"},
          {name: "Saul Perlmutter", contribution: "Co-discovered accelerating expansion using Type Ia supernovae"},
          {name: "Adam Riess", contribution: "Co-discovered dark energy acceleration (1998)"},
          {name: "Brian Schmidt", contribution: "Led supernova team discovering cosmic acceleration"},
          {name: "Planck Collaboration", contribution: "Provided precision measurements of cosmological parameters"}
        ],
        facts: [
          "Age: 13.8 billion years",
          "Temperature: 2.725 Kelvin",
          "Contains ~2 trillion galaxies",
          "Accelerating expansion",
          "95% dark matter and dark energy"
        ]
      },

      19: {
        title: "Modern Observations - Reading the Cosmos",
        what: "Today's telescopes and detectors measure the universe with incredible precision, from the cosmic microwave background to gravitational waves.",
        simple: "We've become cosmic detectives, using every type of light and even ripples in spacetime itself to understand the universe. Each observation is like a clue that helps us piece together the cosmic story.",
        importance: "These observations test our theories and reveal new mysteries like dark matter and dark energy. They turn cosmology from speculation into precision science.",
        evidence: "The Planck satellite mapped the CMB to incredible precision. LIGO detects gravitational waves. Telescopes see back 13.5 billion years.",
        analogy: "Like having different types of cameras - some see heat, some see radio waves, some even 'see' gravity itself. Each shows us a different view of the same universe.",
        scientific: "Modern cosmological observations employ multi-messenger astronomy combining electromagnetic radiation, gravitational waves, neutrinos, and cosmic rays. CMB experiments like Planck achieve μ K precision in temperature measurements. Galaxy surveys (SDSS, DES, Euclid) map billion-galaxy volumes measuring baryon acoustic oscillations and weak lensing. Gravitational wave interferometry (LIGO/Virgo) detects strain h ~ 10⁻²¹. Type Ia supernovae serve as standard candles for dark energy studies. The combination constrains cosmological parameters to percent-level precision, establishing the standard ΛCDM model.",
        equations: [
          "\\(\\Delta T/T \\sim 10^{-5}\\) (CMB temperature fluctuation level)",
          "\\(h_{strain} = \\frac{\\Delta L}{L} \\sim 10^{-21}\\) (gravitational wave strain sensitivity)",
          "\\(m - M = 5\\log_{10}(d_L/10 \\text{pc})\\) (distance modulus for supernovae)",
          "\\(P(k) = \\frac{2\\pi^2}{k^3}A_s\\left(\\frac{k}{k_*}\\right)^{n_s-1}\\) (primordial power spectrum)"
        ],
        scientists: [
          {name: "George Smoot", contribution: "Led COBE team discovering CMB anisotropies (1992)"},
          {name: "John Mather", contribution: "Measured CMB blackbody spectrum with COBE"},
          {name: "Rainer Weiss", contribution: "Pioneered laser interferometry for gravitational wave detection"},
          {name: "Kip Thorne", contribution: "Theoretical foundations of gravitational wave astronomy"},
          {name: "Barry Barish", contribution: "Led LIGO construction and first detections"}
        ],
        facts: [
          "CMB measured to 0.00001 K precision",
          "Can see galaxies 13.5 billion light-years away",
          "Detected gravitational waves from black hole mergers",
          "Dark energy: 68.5% of universe",
          "Dark matter: 26.8% of universe"
        ]
      },

      20: {
        title: "Gravitational Waves - Ripples in Spacetime",
        what: "Gravitational waves are ripples in the fabric of spacetime itself, created by accelerating masses. We've detected them from colliding black holes and neutron stars.",
        simple: "Imagine spacetime as a trampoline. When massive objects move violently - like black holes colliding - they create ripples that travel across the universe at light speed. We can now 'hear' these cosmic vibrations!",
        importance: "This gives us a completely new way to observe the universe. We can 'hear' events that produce no light, like black hole mergers.",
        evidence: "LIGO and Virgo have detected dozens of gravitational wave events since 2015, opening a new era in astronomy.",
        analogy: "Like dropping stones in a pond - the ripples spread out. Except the 'pond' is spacetime itself, and the 'stones' are colliding black holes.",
        scientific: "Gravitational waves are transverse, quadrupole perturbations of spacetime propagating at c, described by h_{μν} in linearized general relativity. The wave equation follows from Einstein's field equations: □h_{μν} = -16πG T_{μν}^{TT}. Binary systems lose energy via gravitational radiation at rate dE/dt = -32/5 (G/c⁵)(μ M²/r⁴)(v/c)¹⁰. LIGO uses Michelson interferometry with arm lengths L = 4 km to measure strain h = ΔL/L ~ 10⁻²¹. Detection enables tests of strong-field gravity, black hole physics, and cosmology.",
        equations: [
          "\\(h_{+,\\times} = \\frac{4G}{c^4 r}\\ddot{I}_{ij}^{TT}\\) (quadrupole formula)",
          "\\(\\frac{dE}{dt} = -\\frac{G}{5c^5}\\langle\\dddot{I}_{ij}\\dddot{I}_{ij}\\rangle\\) (energy loss rate)",
          "\\(f_{GW} = 2f_{orb} = \\frac{1}{\\pi}\\sqrt{\\frac{GM}{r^3}}\\) (gravitational wave frequency)",
          "\\(h(t) = \\frac{1}{2}[h_+(t)(F_+^a \\hat{e}_+^a) + h_{\\times}(t)(F_{\\times}^a \\hat{e}_{\\times}^a)]\\) (detector response)"
        ],
        scientists: [
          {name: "Albert Einstein", contribution: "Predicted gravitational waves in general relativity (1916)"},
          {name: "Joseph Weber", contribution: "First attempted gravitational wave detection with bar detectors"},
          {name: "Russell Hulse", contribution: "Discovered binary pulsar providing indirect GW evidence"},
          {name: "Joseph Taylor", contribution: "Confirmed GW energy loss in binary pulsar system"},
          {name: "Rainer Weiss", contribution: "Invented laser interferometer technique for GW detection"}
        ],
        facts: [
          "Travel at the speed of light",
          "Stretch and squeeze space as they pass",
          "Detected from black hole mergers",
          "LIGO can measure distortions smaller than a proton",
          "Predicted by Einstein in 1916, detected in 2015"
        ]
      },

      21: {
        title: "The Far Future - Dark Energy's Dominion",
        what: "The universe will expand forever, accelerating due to dark energy. Galaxies will drift apart, stars will die out, and the universe will become cold and dark.",
        simple: "The universe is like a party that never ends but slowly winds down. Galaxies drift apart like guests leaving, stars burn out like candles, and eventually only darkness remains. But that's trillions of years away!",
        importance: "This tells us the ultimate fate of everything - a cold, dark, expanded universe. But it also means we live in the universe's vibrant youth.",
        evidence: "Observations of distant supernovae show the expansion is accelerating. Dark energy appears to be constant, implying eternal expansion.",
        analogy: "Like embers in a fireplace slowly fading to black - except the fireplace keeps getting bigger, making the remaining embers seem even more isolated.",
        scientific: "If dark energy maintains constant density ρ_Λ = Λ/(8πG) with equation of state w = -1, the universe undergoes eternal exponential expansion with scale factor a(t) ∝ e^{Ht} where H = √(Λ/3). The de Sitter horizon at distance c/H = (3/Λ)^{1/2} causally disconnects regions. Stellar evolution proceeds: main sequence ends at ~10¹⁴ yr, white dwarfs cool by ~10¹⁵ yr, protons decay (if at all) by ~10³⁴ yr. Black holes evaporate via Hawking radiation on timescales t_evap ∝ M³, with stellar-mass holes lasting ~10⁶⁷ yr and supermassive holes ~10¹⁰⁰ yr. The universe approaches maximum entropy.",
        equations: [
          "\\(a(t) \\propto e^{H\\infty t}\\) where \\(H_\\infty = \\sqrt{\\frac{\\Lambda}{3}}\\) (de Sitter expansion)",
          "\\(r_{horizon} = \\frac{c}{H} = \\sqrt{\\frac{3}{\\Lambda}}\\) (de Sitter horizon)",
          "\\(t_{evap} = \\frac{5120\\pi G^2 M^3}{\\hbar c^4} \\approx 10^{67}\\left(\\frac{M}{M_\\odot}\\right)^3\\) yr (black hole evaporation time)",
          "\\(T_{BH} = \\frac{\\hbar c^3}{8\\pi G M k_B}\\) (Hawking temperature)"
        ],
        scientists: [
          {name: "Stephen Hawking", contribution: "Predicted black hole evaporation via quantum effects (1974)"},
          {name: "Freeman Dyson", contribution: "Analyzed far future stellar evolution and energy sources"},
          {name: "Jamal Islam", contribution: "Calculated timescales for cosmic evolution and proton decay"},
          {name: "Fred Adams", contribution: "Comprehensive study of stelliferous era and cosmic future"},
          {name: "Gregory Laughlin", contribution: "Modeled the five ages of the universe evolution"}
        ],
        facts: [
          "Expansion accelerating since 5 billion years ago",
          "Galaxies will become isolated islands",
          "Last stars die in 100 trillion years",
          "Black holes evaporate in 10¹⁰⁰ years",
          "Universe approaches maximum entropy"
        ]
      },
      22: {
        title: "Cosmological Observations - Mapping the Universe",
        what: "Modern astronomy uses sophisticated instruments to measure the universe's structure, composition, and history through cosmic microwave background studies, supernova surveys, and large-scale structure mapping.",
        simple: "We've become cosmic detectives, using space telescopes and massive ground-based observatories to measure the universe like never before. We can now see the afterglow of the Big Bang and trace how galaxies formed over billions of years.",
        importance: "These observations revolutionized cosmology from philosophy to precision science. They discovered dark matter, dark energy, and confirmed the Big Bang theory with extraordinary accuracy.",
        evidence: "The Planck satellite mapped temperature fluctuations in the cosmic microwave background to microkelvin precision. Type Ia supernovae showed the universe's expansion is accelerating. Galaxy surveys reveal the cosmic web structure.",
        analogy: "Like archaeologists studying ancient civilizations, but instead of digging in dirt, we're digging through time by looking at light that has traveled for billions of years to reach us.",
        scientific: "The Cosmic Microwave Background (CMB) provides a pristine snapshot of the universe at recombination (z ≈ 1100). Its temperature anisotropies δT/T ≈ 10⁻⁵ encode information about cosmological parameters through acoustic oscillations in the primordial plasma. The angular power spectrum C_ℓ shows characteristic peaks at ℓ ≈ 220, 540, 800 corresponding to the sound horizon at recombination. Type Ia supernovae serve as 'standard candles' because their peak luminosity L correlates with light curve decline rate Δm₁₅. Distance modulus μ = m - M = 5log₁₀(d_L/10pc) measurements revealed cosmic acceleration at z ≈ 0.7. Large-scale structure surveys map baryon acoustic oscillations, providing a 'standard ruler' of ~150 Mpc comoving scale.",
        equations: [
          "\\(\\frac{\\delta T}{T} = \\sum_{\\ell m} a_{\\ell m} Y_{\\ell}^m(\\theta, \\phi)\\) (CMB temperature fluctuations)",
          "\\(C_\\ell = \\langle |a_{\\ell m}|^2 \\rangle\\) (angular power spectrum)",
          "\\(\\mu = m - M = 5\\log_{10}\\left(\\frac{d_L}{10\\text{ pc}}\\right)\\) (distance modulus)",
          "\\(d_L = (1+z) \\int_0^z \\frac{c dz'}{H(z')}\\) (luminosity distance)",
          "\\(\\theta_s = \\frac{r_s(z_*)}{d_A(z_*)} \\approx 1.04°\\) (sound horizon angle)"
        ],
        scientists: [
          {name: "George Smoot", contribution: "Led COBE satellite, discovered CMB anisotropies (Nobel Prize 2006)"},
          {name: "John Mather", contribution: "COBE project leader, measured CMB blackbody spectrum (Nobel Prize 2006)"},
          {name: "Saul Perlmutter", contribution: "Supernova Cosmology Project, discovered cosmic acceleration (Nobel Prize 2011)"},
          {name: "Adam Riess", contribution: "High-z Supernova Search, refined acceleration measurements (Nobel Prize 2011)"},
          {name: "Brian Schmidt", contribution: "High-z Supernova Search leader (Nobel Prize 2011)"},
          {name: "Planck Collaboration", contribution: "Precision CMB measurements with 6-parameter ΛCDM model"}
        ],
        facts: [
          "CMB temperature: 2.7255 ± 0.0006 K",
          "Universe is 13.787 ± 0.020 billion years old",
          "Dark matter: 26.8% of universe",
          "Dark energy: 68.3% of universe",
          "Ordinary matter: only 4.9% of universe",
          "Universe is geometrically flat to 0.4% precision"
        ]
      },
      23: {
        title: "Gravitational Wave Background - Ripples in Spacetime",
        what: "Gravitational waves are ripples in the fabric of spacetime itself, predicted by Einstein and first directly detected in 2015. They provide a completely new way to observe the universe, revealing events invisible to traditional telescopes.",
        simple: "Imagine spacetime as a stretched rubber sheet. When massive objects like black holes spiral into each other, they create waves that ripple outward through space itself. These waves are so tiny they stretch space by less than 1/10,000th the width of a proton!",
        importance: "Gravitational waves opened an entirely new field of astronomy. They let us 'hear' the universe in addition to seeing it, revealing phenomena like black hole mergers and providing tests of Einstein's theory in extreme conditions.",
        evidence: "LIGO/Virgo detectors have recorded dozens of black hole and neutron star mergers. The first detection (GW150914) matched Einstein's predictions perfectly. Pulsar timing arrays are searching for a stochastic gravitational wave background.",
        analogy: "Like being able to feel earthquake tremors from across the planet, but instead the 'earthquakes' are colliding black holes billions of light-years away, and the 'ground' is space itself.",
        scientific: "Gravitational waves are solutions to Einstein's field equations representing perturbations h_μν in the metric tensor: g_μν = η_μν + h_μν where |h_μν| << 1. In the transverse-traceless gauge, waves propagate at speed c with two polarization states h₊ and h×. The strain amplitude scales as h ~ (GM/rc²)(v/c)², where M is the total mass, r is distance, and v is orbital velocity. For inspiraling binaries, frequency evolution follows df/dt = 96π/5 (πGM_chirp f/c³)^(11/3) where M_chirp = (m₁m₂)³/⁵/(m₁+m₂)¹/⁵ is the chirp mass. Advanced LIGO achieves strain sensitivity ~10⁻²³ using laser interferometry with 4 km arms.",
        equations: [
          "\\(g_{\\mu\\nu} = \\eta_{\\mu\\nu} + h_{\\mu\\nu}\\) (linearized metric)",
          "\\(\\frac{df}{dt} = \\frac{96\\pi}{5}\\left(\\frac{\\pi G\\mathcal{M}f}{c^3}\\right)^{11/3}\\) (frequency evolution)",
          "\\(\\mathcal{M} = \\frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}}\\) (chirp mass)",
          "\\(h(t) = \\frac{4G\\mathcal{M}^{5/3}(\\pi f)^{2/3}}{c^4 r}\\) (strain amplitude)",
          "\\(P_{GW} = \\frac{32}{5}\\frac{G^4}{c^5}\\frac{(m_1 m_2)^2(m_1+m_2)}{r^{10}}\\) (radiated power)"
        ],
        scientists: [
          {name: "Albert Einstein", contribution: "Predicted gravitational waves in general relativity (1916)"},
          {name: "Rainer Weiss", contribution: "Conceived laser interferometer design (Nobel Prize 2017)"},
          {name: "Kip Thorne", contribution: "Theoretical foundations of gravitational wave astronomy (Nobel Prize 2017)"},
          {name: "Barry Barish", contribution: "Led Advanced LIGO project (Nobel Prize 2017)"},
          {name: "Joseph Weber", contribution: "First attempts at gravitational wave detection (1960s-1970s)"},
          {name: "Russell Hulse & Joseph Taylor", contribution: "Discovered first binary pulsar PSR B1913+16 (Nobel Prize 1993)"}
        ],
        facts: [
          "First detection: GW150914 (September 14, 2015)",
          "Merged two ~30 solar mass black holes",
          "Released 3 solar masses as gravitational wave energy",
          "Peak power: 3.6 × 10²⁸ watts (more than all stars in observable universe)",
          "LIGO sensitivity: 10⁻²¹ strain (1/10,000 width of proton)",
          "Over 90 confirmed detections by 2023"
        ]
      },
      24: {
        title: "Multiverse Theory - Beyond Our Cosmic Horizon",
        what: "The multiverse hypothesis suggests that our observable universe may be just one of countless universes existing in a vast 'multiverse.' Different theories propose various types of multiverses with different physical laws and constants.",
        simple: "Imagine our entire universe - with its 100 billion galaxies - is just one soap bubble in a cosmic bubble bath. Each bubble might have different physics, different constants, or even different numbers of dimensions. We can only see inside our own bubble.",
        importance: "If true, the multiverse could explain why our universe seems perfectly fine-tuned for life. With infinite universes having random properties, some would inevitably have the right conditions for stars, planets, and life to exist.",
        evidence: "While direct evidence is impossible, inflation theory naturally produces eternal inflation creating pocket universes. String theory suggests a vast 'landscape' of possible universes. The anthropic principle explains fine-tuning without design.",
        analogy: "Like living in one house in an infinite city where every house has different rules, different colors, and different inhabitants - but you can never leave your house to see the others.",
        scientific: "The Level I multiverse arises from infinite space beyond our Hubble horizon. Level II emerges from eternal inflation where different regions undergo separate inflation events with random vacuum states. Slow-roll inflation has probability P ∝ e^(-S[φ]) where S[φ] is the action for inflaton field φ. The string theory landscape contains ~10^500 vacuum states with different cosmological constants Λ. The anthropic principle suggests we observe Λ ≈ 10^(-123) because larger values prevent structure formation. Level III involves quantum many-worlds interpretation where wavefunction branches create parallel realities. Level IV proposes all mathematically consistent structures exist as physical realities.",
        equations: [
          "\\(P(\\Lambda) = \\frac{d\\text{Vol}}{d\\Lambda} \\cdot P_{\\text{obs}}(\\Lambda)\\) (anthropic probability distribution)",
          "\\(P \\propto e^{-S[\\phi]}\\) where \\(S[\\phi] = \\int d^4x \\sqrt{-g}\\left[\\frac{1}{2}(\\partial\\phi)^2 - V(\\phi)\\right]\\) (tunneling probability)",
          "\\(H = \\sqrt{\\frac{V(\\phi)}{3M_p^2}}\\) (Hubble rate during inflation)",
          "\\(N_{landscape} \\sim 10^{500}\\) (estimated string theory vacua)",
          "\\(\\rho_{vac} = \\frac{\\Lambda c^2}{8\\pi G} \\approx 10^{-29}\\text{ g/cm}^3\\) (vacuum energy density)"
        ],
        scientists: [
          {name: "Hugh Everett III", contribution: "Proposed many-worlds interpretation of quantum mechanics (1957)"},
          {name: "Andrei Linde", contribution: "Developed eternal inflation theory (1980s)"},
          {name: "Alan Guth", contribution: "Inflation theory naturally leads to multiverse (1981)"},
          {name: "Max Tegmark", contribution: "Classified multiverse into four levels (2003)"},
          {name: "Leonard Susskind", contribution: "String theory landscape and anthropic reasoning"},
          {name: "Brian Greene", contribution: "Popular exposition of multiverse concepts"},
          {name: "Alexander Vilenkin", contribution: "Eternal inflation and quantum tunneling in cosmology"}
        ],
        facts: [
          "Type I: Regions beyond our cosmic horizon",
          "Type II: Different post-inflation bubble universes",
          "Type III: Quantum many-worlds parallel realities",
          "Type IV: All mathematical structures exist physically",
          "String landscape: ~10^500 possible universes",
          "Our universe's fine-tuning may not require design",
          "Direct observation is fundamentally impossible"
        ]
      }
    };
  }
}

// Initialize modal system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicModal = new CosmicModal();
});

// Modal styling CSS to inject
const modalStyles = `
<style>
.info-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.info-modal.active {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: rgba(20, 20, 30, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 100, 100, 0.3);
  transform: rotate(90deg);
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, rgba(102, 126, 234, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-section {
  margin-bottom: 25px;
}

.modal-section h4 {
  font-size: 1.2rem;
  color: rgba(0, 242, 254, 1);
  margin-bottom: 10px;
  font-weight: 600;
}

.modal-section p {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.modal-section.analogy {
  background: rgba(102, 126, 234, 0.1);
  border-left: 3px solid rgba(102, 126, 234, 0.5);
  padding: 15px;
  border-radius: 8px;
}

.modal-section.scientific {
  background: rgba(0, 242, 254, 0.08);
  border-left: 3px solid rgba(0, 242, 254, 0.4);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.modal-section.equations {
  background: rgba(255, 200, 0, 0.08);
  border: 1px solid rgba(255, 200, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.equation-item {
  padding: 8px 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 200, 0, 0.1);
}

.equation-item:last-child {
  border-bottom: none;
}

.modal-section.scientists {
  background: rgba(240, 147, 251, 0.08);
  border-left: 3px solid rgba(240, 147, 251, 0.4);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.modal-section.scientists ul {
  list-style: none;
  padding: 0;
}

.modal-section.scientists li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(240, 147, 251, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.modal-section.scientists li:last-child {
  border-bottom: none;
}

.modal-section.scientists strong {
  color: rgba(240, 147, 251, 1);
}

.modal-facts {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.modal-facts h4 {
  font-size: 1.1rem;
  color: rgba(255, 200, 0, 1);
  margin-bottom: 15px;
}

.modal-facts ul {
  list-style: none;
  padding: 0;
}

.modal-facts li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: rgba(255, 255, 255, 0.8);
}

.modal-facts li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: rgba(0, 242, 254, 0.6);
}

.info-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 100;
  font-size: 16px;
  font-weight: bold;
}

.info-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.8);
  transform: scale(1.1);
}

.info-btn svg {
  width: 20px;
  height: 20px;
}

/* Scrollbar styling for modal */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.8);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    padding: 25px;
    max-width: calc(100vw - 40px);
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .info-btn {
    width: 35px;
    height: 35px;
  }
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);