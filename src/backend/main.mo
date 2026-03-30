import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

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

  func compareModules(m1 : Module, m2 : Module) : Order.Order {
    Nat.compare(m1.orderIndex, m2.orderIndex);
  };

  func compareQuestions(q1 : Question, q2 : Question) : Order.Order {
    Nat.compare(q1.id, q2.id);
  };

  func compareQuotes(q1 : Quote, q2 : Quote) : Order.Order {
    Nat.compare(q1.id, q2.id);
  };

  let modules = Map.empty<Nat, Module>();
  let quotes = Map.empty<Nat, Quote>();
  let questions = Map.empty<Nat, Question>();

  public query func getModules() : async [Module] {
    modules.values().toArray().sort(compareModules);
  };

  public query func getQuotes() : async [Quote] {
    quotes.values().toArray().sort(compareQuotes);
  };

  public query func getQuestionsByModule(moduleId : Nat) : async [Question] {
    questions.values().toArray().filter(func(q : Question) : Bool { q.moduleId == moduleId }).sort(compareQuestions);
  };

  public shared func isAdminPasswordCorrect(password : Text) : async Bool {
    Text.equal(password, "Tesla786");
  };

  public shared func addModule(id : Nat, name : Text, orderIndex : Nat) : async () {
    let newModule : Module = { id; name; orderIndex };
    modules.add(id, newModule);
  };

  public shared func deleteModule(id : Nat) : async () {
    modules.remove(id);
  };

  public shared func addQuote(id : Nat, text : Text, author : Text) : async () {
    let newQuote : Quote = { id; text; author };
    quotes.add(id, newQuote);
  };

  public shared func addQuestion(id : Nat, moduleId : Nat, questionText : Text, options : [Text], correctOptionIndex : Nat, explanation : Text, createdAt : Int) : async () {
    if (options.size() != 4) {
      Runtime.trap("Exactly 4 options must be provided.");
    };
    let newQuestion : Question = { id; moduleId; questionText; options; correctOptionIndex; explanation; createdAt };
    questions.add(id, newQuestion);
  };

  public shared func deleteQuestion(id : Nat) : async () {
    questions.remove(id);
  };
};
