describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait(500);
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должен добавить начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });

    it('должен добавить соус в конструктор', () => {
      cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible');
      cy.contains('Соус Spicy-X')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Соус Spicy-X').should('be.visible');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').closest('a').click();

      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.get('#modals').should('not.be.empty');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка N-200i').closest('a').click();
      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.contains('Краторная булка N-200i').should('be.visible');

      cy.get('#modals').find('button').first().click();
      cy.get('#modals').should('be.empty');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').closest('a').click();
      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.contains('Краторная булка N-200i').should('be.visible');

      cy.get('#modals').children('div').last().click({ force: true });
      cy.get('#modals').should('be.empty');
    });

    it('должен отображать правильные данные ингредиента в модальном окне', () => {
      cy.contains('Биокотлета из марсианской Магнолии').closest('a').click();

      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Калории, ккал').should('be.visible');
      cy.contains('4242').should('be.visible');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      cy.setCookie('accessToken', 'test-access-token');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser', { timeout: 10000 });
      cy.wait(500);
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookies();
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').should('be.enabled').click();

      cy.wait('@createOrder', { timeout: 10000 });

      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.get('#modals').should('not.be.empty');
      cy.contains('12345').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
    });

    it('должен закрыть модальное окно заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').should('be.enabled').click();

      cy.wait('@createOrder', { timeout: 10000 });

      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.contains('12345').should('be.visible');

      cy.get('#modals').find('button').first().click();

      cy.get('#modals').should('be.empty');
    });

    it('должен очистить конструктор после создания заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').should('be.enabled').click();

      cy.wait('@createOrder', { timeout: 10000 });

      cy.get('#modals', { timeout: 5000 }).should('exist');
      cy.contains('12345').should('be.visible');

      cy.get('#modals').find('button').first().click();

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
