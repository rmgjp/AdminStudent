!macro customInstall
  ExecWait '"msiexec" /i "$INSTDIR\build\mariadb.msi" SERVICENAME=AdminStudent INSTALLDIR=C:\adminstudent DATADIR=C:\adminstudent\data PORT=3306 PASSWORD=uxrlrpaqga9lfe9l /passive'
  ExecWait '"msiexec" /i "$INSTDIR\build\node.msi" /passive'
!macroend

!macro customUninstall
  ExecWait '"msiexec" /x "$INSTDIR\build\mariadb.msi" REMOVE=ALL /passive'
  ExecWait '"msiexec" /x "$INSTDIR\build\node.msi" /passive'
!macroend