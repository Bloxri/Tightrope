#pragma strict

private var myRenderer : Renderer;
var myColor : Color;

function Start () {
myRenderer = GetComponent.<Renderer>();
}

function Update () {
if(myRenderer.material.color!=myColor)
myRenderer.material.color = myColor;
}