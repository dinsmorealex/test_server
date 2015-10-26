const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
const int buttonPin = 13;
int sensorValue = 0;        // value read from the pot
int prevsensorValue = 0;
int outputValue =0;

int buttonState = 0;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
  pinMode(buttonPin, INPUT);
}

void loop() {
  // read the analog in value:
  sensorValue = analogRead(analogInPin);
  outputValue = map(sensorValue, 0, 1023, 0, 274700); 
  
  buttonState = digitalRead(buttonPin);

if (buttonState == LOW){
  Serial.write("Y");
  Serial.write("on");
  Serial.write("Z");
  delay(200); 
}

  // If the previous value is the same as the new one, the do not send to save
  // communication link between the Arduino and the PC. 
  if (prevsensorValue != outputValue) {
    // print the results to the serial monitor:
    Serial.print("A"); // Print the letter A to signal the beginning of an Input
    Serial.print(outputValue); // Send the sensor Value (this is an integer)
    Serial.print("B"); // Print the letter B to signal the end of an Input
    prevsensorValue = outputValue; // Change the previous sensor value
  }
  // wait 100 milliseconds before the next loop
  // for the analog-to-digital converter to settle
  // after the last reading. If you are sending too fast
  // there is also a tendency to flood the communication line.
  delay(100);                     
}
