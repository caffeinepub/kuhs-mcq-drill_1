import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type Quote = {
    id : Nat;
    text : Text;
    author : Text;
  };

  type Module = {
    id : Nat;
    name : Text;
    orderIndex : Nat;
  };

  type Question = {
    id : Nat;
    moduleId : Nat;
    questionText : Text;
    options : [Text];
    correctOptionIndex : Nat;
    explanation : Text;
    createdAt : Int;
  };

  module Question {
    public func compare(q1 : Question, q2 : Question) : Order.Order {
      Nat.compare(q1.id, q2.id);
    };
  };

  module Quote {
    public func compare(quote1 : Quote, quote2 : Quote) : Order.Order {
      Nat.compare(quote1.id, quote2.id);
    };
  };

  module Module {
    public func compare(module1 : Module, module2 : Module) : Order.Order {
      Nat.compare(module1.orderIndex, module2.orderIndex);
    };
  };

  let modules = Map.fromIter<Nat, Module>([(1, { id = 1; name = "Sample Module"; orderIndex = 1 })].values());
  let quotes = Map.fromIter<Nat, Quote>([(1, { id = 1; text = "Keep going!"; author = "Anonymous" })].values());
  let questions = Map.fromIter<Nat, Question>(
    [(1, { id = 1; moduleId = 1; questionText = "Sample question?"; options = ["A", "B", "C", "D"]; correctOptionIndex = 0; explanation = "Sample explanation"; createdAt = 0 })].values()
  );

  public query ({ caller }) func getModules() : async [Module] {
    modules.values().toArray().sort();
  };

  public query ({ caller }) func getQuotes() : async [Quote] {
    quotes.values().toArray().sort();
  };

  public query ({ caller }) func getQuestionsByModule(moduleId : Nat) : async [Question] {
    questions.values().toArray().filter(
      func(q) { q.moduleId == moduleId }
    ).sort();
  };

  public shared ({ caller }) func isAdminPasswordCorrect(password : Text) : async Bool {
    Text.equal(password, "adminpw");
  };

  public shared ({ caller }) func addModule(id : Nat, name : Text, orderIndex : Nat) : async () {
    let newModule : Module = {
      id;
      name;
      orderIndex;
    };
    modules.add(id, newModule);
  };

  public shared ({ caller }) func addQuote(id : Nat, text : Text, author : Text) : async () {
    let newQuote : Quote = {
      id;
      text;
      author;
    };
    quotes.add(id, newQuote);
  };

  public shared ({ caller }) func addQuestion(id : Nat, moduleId : Nat, questionText : Text, options : [Text], correctOptionIndex : Nat, explanation : Text, createdAt : Int) : async () {
    if (options.size() != 4) {
      Runtime.trap("Exactly 4 options must be provided.");
    };
    let newQuestion : Question = {
      id;
      moduleId;
      questionText;
      options;
      correctOptionIndex;
      explanation;
      createdAt;
    };
    questions.add(id, newQuestion);
  };
};
