#pragma strict

//No need to attach this to any object

var fog : boolean = false;
var fogColor : Color;
var fogMode : FogMode;
var fogDensity : float;
var fogStartDistance : float;
var fogEndDistance : float;
var ambientLight : Color;
var skybox : Material;
var haloStrength : float;
var flareStrength : float;
var flareFadeSpeed : float;
// var haloTexture : Texture2D;
// var spotCookie : Texture2D;

var lightProbes : LightProbes;

function Start()
{

}

function SetSettings()
{

	fog = RenderSettings.fog;
	fogColor = RenderSettings.fogColor;
	fogMode = RenderSettings.fogMode;
	fogDensity = RenderSettings.fogDensity;
	fogStartDistance = RenderSettings.fogStartDistance;
	fogEndDistance = RenderSettings.fogEndDistance;
	ambientLight = RenderSettings.ambientLight;
	skybox = RenderSettings.skybox;
	haloStrength = RenderSettings.haloStrength;
	flareStrength = RenderSettings.flareStrength;
	flareFadeSpeed = RenderSettings.flareFadeSpeed;
	// haloTexture = RenderSettings.haloTexture;
	// spotCookie = RenderSettings.spotCookie;
	lightProbes = LightmapSettings.lightProbes;

}
function LoadSettings()
{

	// RenderSettings.fog = fog;
	// RenderSettings.fogColor = fogColor;
	// RenderSettings.fogMode = fogMode;
	// RenderSettings.fogDensity = fogDensity;
	// RenderSettings.fogStartDistance = fogStartDistance;
	// RenderSettings.fogEndDistance = fogEndDistance;
	// RenderSettings.ambientLight = ambientLight;
	// RenderSettings.skybox = skybox;
	// RenderSettings.haloStrength = haloStrength;
	// RenderSettings.flareStrength = flareStrength;
	// RenderSettings.flareFadeSpeed = flareFadeSpeed;
	// LightmapSettings.lightProbes = lightProbes;
}