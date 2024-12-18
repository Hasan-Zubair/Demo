/// <reference types="cypress" />

describe("VeraAutomation", () => {
  it("Header and footer Test", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/");
    cy.get("li:nth-of-type(1) > a").click();
    cy.get("div.logo > svg").click();
    cy.get("li:nth-of-type(2) > a").click();
    cy.get("div.nav-wrapper path:nth-of-type(4)").click();
    cy.get("li:nth-of-type(3) > a").click();
    cy.get("li:nth-of-type(4) > a").click();
    cy.get("div.nav-wrapper p").click();
    cy.get("div.login-screen-top-logo > svg").click();
    cy.get("button.started-btn").click();
    cy.get("div.onboarding-screen-top-logo path:nth-of-type(3)").click();
    //cy.get("div.onboarding-screen-top-logo path:nth-of-type(3)").click();
    //cy.get("div.onboarding-screen-top-logo path:nth-of-type(2)").click();
    //cy.get("div.onboarding-screen-top-logo path:nth-of-type(2)").click();
    //cy.get("div.onboarding-screen-top-logo > svg").click();
    cy.visit("https://dev.veralegal.uk/");
    cy.get("button.voice-btn").click();
    //cy.get("div.onboarding-screen-top-logo > svg").click();
    cy.visit("https://dev.veralegal.uk/");
    cy.get("div:nth-of-type(3) button.cta-btn-started").click();
    //  cy.get("div.onboarding-screen-top-logo path:nth-of-type(4)").click();
    // cy.get("div.onboarding-screen-top-logo path:nth-of-type(4)").click();
    cy.visit("https://dev.veralegal.uk/");
    cy.get("p.footer-atorney-link").click();
    cy.get("div.signup-screen-top-logo path:nth-of-type(3)").click();
    cy.get(
      "div.footer-container div:nth-of-type(3) > p:nth-of-type(1)",
    ).click();
    cy.get(
      "div.footer-container div:nth-of-type(3) > p:nth-of-type(2)",
    ).click();
  });

  it("tests video intraction test", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/");
    cy.get("li:nth-of-type(2) > a").click();
    cy.get("div.process-explainer-wrapper svg").click();
    cy.get("#process path").click();
  });

  it("tests separation bar button", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/#process");
    cy.get("li:nth-of-type(2) > a").click();
    cy.get("li:nth-of-type(3) > a").click();
    cy.get("div:nth-of-type(6) button.cta-btn-started").click();
    cy.visit("https://dev.veralegal.uk/#faqs");
    cy.get("div:nth-of-type(6) button.cta-btn-voice").click();
    cy.visit("https://dev.veralegal.uk/#faqs");
  });

  it("tests slide buttons", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/#faqs");
    cy.get("li:nth-of-type(1) > a").click();
    cy.get("li:nth-of-type(2) > a").click();
    cy.get("svg.control-next > path").click();
    cy.get("svg.control-next > path").click();
    cy.get("svg.control-next > path").click();
    cy.get("svg.control-prev > path").click();
    cy.get("svg.control-prev > path").click();
    cy.get("svg.control-prev > path").click();
    cy.get("svg.control-prev > path").click();
    cy.get("svg.control-prev > path").click();
  });

  it("tests faq", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/#faqs");
    cy.get("li:nth-of-type(3) > a").click();
    cy.get("div.faq-accordian-wrapper > div:nth-of-type(1) svg").click();
    cy.get("div.faq-accordian-wrapper > div:nth-of-type(2) path").click();
    cy.get("div.view-more-wrapper svg").click();
    cy.get("#faqs > div > div:nth-of-type(3) > div:nth-of-type(1) svg").click();
    cy.get("div:nth-of-type(3) > div:nth-of-type(2) path").click();
    cy.get("div:nth-of-type(3) > div:nth-of-type(3) path").click();
    cy.get("div:nth-of-type(3) > div:nth-of-type(4) svg").click();
    cy.get(
      "#faqs > div > div:nth-of-type(4) > div:nth-of-type(1) path",
    ).click();
    cy.get("div:nth-of-type(4) > div:nth-of-type(2) svg").click();
  });

  it("tests contactUs", () => {
    cy.viewport(1349, 657);
    cy.visit("https://dev.veralegal.uk/#faqs");
    cy.get("li:nth-of-type(4) > a").click();
    cy.get("div.css-isbt42 > div:nth-of-type(1) input").click();
    cy.get("div.css-isbt42 > div:nth-of-type(1) input").type("testing");
    cy.get("div.css-isbt42 > div:nth-of-type(2) input").click();
    cy.get("div.css-isbt42 > div:nth-of-type(2) input").type("test");
    cy.get("div.css-173nq8r > div:nth-of-type(1) input").click();
    cy.get("div.css-173nq8r > div:nth-of-type(1) input").type(
      "pucar15sahiwal@gmail.com",
    );
    cy.get("#\\:r3\\:").click();
    cy.get("#\\:r3\\:").type("+44 1234 5678999");
    cy.get("textarea:nth-of-type(1)").click();
    cy.get("textarea:nth-of-type(1)").type("test mail");
    cy.get("#\\:r5\\:").click();
    cy.get("div.MuiDialog-root button").click();
  });
});

//-------------------------------------------------------------------------------

describe("questionary", () => {
  it("tests questionary", () => {
    cy.viewport(1366, 657);

    cy.visit("https://dev.veralegal.uk/");
    cy.get("button.started-btn").click();
    cy.get(
      "div.MuiGrid-grid-md-8 > div > div > div > div:nth-of-type(1) circle",
    ).click();
    cy.get("button.next-btn").click();
    cy.get("div:nth-of-type(1) > h5").click();
    cy.get("div:nth-of-type(2) > h5").click();
    cy.get("div:nth-of-type(3) > h5").click();
    cy.get("div:nth-of-type(4) > h5").click();
    cy.get("div:nth-of-type(5) > h5").click();
    cy.get("div:nth-of-type(6) > h5").click();
    cy.get("button.next-btn").click();
    cy.get("#outlined-basic").click();
    cy.get("#outlined-basic").type("testing description");
    cy.get("button.next-btn").click();
    cy.get("div.MuiGrid-grid-md-8 > div > div:nth-of-type(1) input").click();
    cy.get("div.MuiGrid-grid-md-8 > div > div:nth-of-type(1) input").type(
      "test",
    );
    cy.get(
      "div.MuiGrid-grid-md-8 > div > div:nth-of-type(2) > div.MuiFormControl-root input",
    ).click();
    // cy.get("div.MuiGrid-grid-md-8 > div > div:nth-of-type(2) > div.MuiFormControl-root input").type("pucar15sahiwal#");
    cy.get(
      "div.MuiGrid-grid-md-8 > div > div:nth-of-type(2) > div.MuiFormControl-root input",
    ).type("pucar15sahiwal@gmail.com");
    cy.get("#\\:rc\\:").click();
    cy.get("#\\:rc\\:").type("+44 1234 5678899");
    cy.get("div:nth-of-type(3) input").click();
    cy.get("div:nth-of-type(3) input").type("12345");
    cy.get(
      "div.MuiContainer-root > div.MuiBox-root div.MuiGrid-grid-md-8 > div",
    ).click();
    cy.get("button.next-btn").click();
    cy.get("div:nth-of-type(6) > p").click();
    cy.get("div.css-19svcxm span.MuiTypography-root").click();
    cy.get("div:nth-of-type(5) > button:nth-of-type(6)").click();
    cy.get("#\\:rf\\:").click();
    // cy.get("div.MuiDialog-root button").click();
    //cy.get(".MuiButtonBase-root").click();

    cy.visit("https://dev.veralegal.uk/");
  });
});
