#Persistent


OnClipboardChange:
if (A_EventInfo = 1)
{
    clipboard := regexreplace(clipboard, "^\s*|\s*$") ;trim ending whitespace
	SetTimer, remove, -1000
	ToolTip, clipboard = '%clipboard%'
}
return


remove:
ToolTip
return