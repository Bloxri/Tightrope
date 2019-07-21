#pragma strict


var clips : AudioClip[];


function PlayCurrent()
{
	GetComponent.<AudioSource>().PlayOneShot(GetComponent.<AudioSource>().clip);
}

function Play(clip : AudioClip)
{
	GetComponent.<AudioSource>().PlayOneShot(clip);
}

function PlayClip(index : int)
{

	GetComponent.<AudioSource>().PlayOneShot(clips[index]);
}