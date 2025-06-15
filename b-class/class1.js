class Person {
  constructor(firstName, lastName) {
    console.log('clog from constructor');

    console.log(this); // Check the output (empty object)
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

const person = new Person();

console.log('clog from outside');
console.log(person);
