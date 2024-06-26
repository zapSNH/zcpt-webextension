import re
import sys

def bump(new_ver_v):
	current_esr = open("ESR_VERSION", 'r').read()
	print(current_esr)
	new_ver = new_ver_v.replace("v", "")
	manifest_template = "\"version\": \"" + new_ver + ".1\""
	updates_template = '''{
  "addons": {
    "coolPhotonTheme@zapsnh": {
      "updates": [
        {
          "version": "''' + new_ver + '''",
          "update_link": "https://github.com/zapSNH/zcpt-webextension/releases/download/v''' + new_ver + '''/zapsCoolPhotonTheme-esr.xpi",
          "applications": {
            "gecko": {
                "strict_min_version": "''' + current_esr + '''.0",
                "strict_max_version": "''' + current_esr + '''.*"
            }
          }
        },
        {
          "version": "''' + new_ver + '''.1",
          "update_link": "https://github.com/zapSNH/zcpt-webextension/releases/download/v''' + new_ver + '''/zapsCoolPhotonTheme.xpi",
          "applications": {
            "gecko": {
                "strict_min_version": "''' + str(int(current_esr)+1) + '''.0"
            }
          }
        }
      ]
    }
  }
}
'''
	versioncss_template = "content: \"zapsCoolPhotonTheme v" + new_ver + " (webextension)\";"
	replace(manifest_template, "manifest.json", "\"version\": \".*\"")
	replaceAll(updates_template, "updates.json")
	replace(versioncss_template, "custom/resources/version.css", "content: \"zapsCoolPhotonTheme v.* \(webextension\)\";")
	
def bumpESR(new_ver_v):
	bump(new_ver_v)
	new_ver = new_ver_v.replace("v", "")
	manifest_template = "\"version\": \"" + new_ver + "\""
	replace(manifest_template, "manifest.json", "\"version\": \".*\"")


def replace(new_ver, file, regex):
	f = open(file, "r")

	content = f.read()
	new_content = re.sub(regex, new_ver, content)

	f.close()
	f = open(file, "w")
	f.write(new_content)
	f.close()
	
def replaceAll(new_ver, file):
	new_content = new_ver

	f = open(file, "w")
	f.write(new_content)
	f.close()

if __name__ == '__main__':
    globals()[sys.argv[1]](sys.argv[2])