// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16


// An array of lines from a text file
var lines;
// The Markov Generator object
var markov;
// An output element
var output;

// Preload some seed data
function preload() {
  lines = loadStrings('hemingway_short_stories.txt');
}

function setup() {
  // Join everything together in one long string
  // Keep carriage returns so these will show up in the markov generator
  var text = lines.join('\n');

  // N-gram length and maximum length
  var randomNum = random(120, 139);
  markov = new MarkovGenerator(10, randomNum);
  markov.feed(text);

  generate();

  // Make the output element
  output = select('#output');

  noCanvas();
}

function generate() {
  // Generate some text
  var text = markov.generate();
  // Put in HTML line breaks wherever there was a carriage return
  text = text.replace(/\n/g,'<br/><br/>');
  text = text.trim() + '.';
  var textArray = [];
  textArray.push(text);
  console.log(textArray);
  save(textArray, 'hemingsay.txt');
  output.html(text);
}

// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// This is based on Allison Parrish's great RWET examples
// https://github.com/aparrish/rwet-examples

// Prototype is magic!  By accessing Array.prototype
// we can augment every single Array object with an new function

// Like python's choice this will return a
// random element from an array
Array.prototype.choice = function() {
  var i = floor(random(this.length));
  return this[i];
}

// A MarkovGenerate object
function MarkovGenerator(n, max) {
  // Order (or length) of each ngram
  this.n = n;
  // What is the maximum amount we will generate?
  this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  this.ngrams = {};
  // A separate array of possible beginnings to generated text
  this.beginnings = [];

  // A function to feed in text to the markov chain
  this.feed = function(text) {

    // Discard this line if it's too short
    if (text.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    var beginning = text.substring(0, this.n);
    this.beginnings.push(beginning);

    // Now let's go through everything and create the dictionary
    for (var i = 0; i < text.length - this.n; i++) {
      var gram = text.substring(i, i + this.n);
      var next = text.charAt(i + this.n);
      // Is this a new one?
      if (!this.ngrams.hasOwnProperty(gram)) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  this.generate = function() {

    // Get a random  beginning
    var current = this.beginnings.choice();
    var output = current;

    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams.hasOwnProperty(current)) {
        // What are all the possible next tokens
        var possible_next = this.ngrams[current];
        // Pick one randomly
        var next = possible_next.choice();
        // Add to the output
        output += next;
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.substring(output.length - this.n, output.length);
      } else {
        break;
      }
    }
    // Here's what we got!
    return output;
  }
}