# checkout-nodejs

Para executar este módulo de checkout, clone este repositório e, no terminal, a partir do diretório do repositório clonado, realize a instalação de dependências via comando

```
npm install
```

e depois execute os testes unitários e funcionais via comando

```
npm test
```

Obs.: Todos os testes deste módulo foram realizados em ambiente Windows 10 (1809) com Node.js v8.11.3.

# Considerações de Design

Este projeto foi baseado em princípios de DDD (Domain-Driven Design), CQRS (Command Query Responsibility Segregation) e, principalmente, Orientação a Objetos. Deste modo, trabalhei com os seguintes objetivos:

1. Dar ênfase ao design do Domain Model, isto é, às entidades do sistema e seus *comportamentos*. 

2. Dar ênfase ao aspecto de testabilidade e interpretação de código, utilizando nomes claros para a nomeação de classes, métodos, variáveis, etc., separando funcionalidades do sistema em pequenos métodos os mais genéricos possíveis, fazendo uso do conceito de injeção de dependências por meio de construtores (possibilitando assim a proteção de invariantes de classes), etc.

3. Dar ênfase a padrões de design que permitam ao sistema/módulo uma evolução consistente e adequada, separando conceitos distintos em camadas distintas, fornecendo testes unitários e funcionais para todos os componentes relevantes, etc.

# Simulações de Teste

Para simular outros casos de teste diferentes dos fornecidos como exemplo, basta adicionar ou alterar testes no arquivo ```test/command.test.js```.
