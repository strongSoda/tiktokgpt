const logUsage = async (payload) => {
    // e.preventDefault();
    const webhookUrl = process.env.NEXT_PUBLIC_SLACK_INCOMING_WEBHOOK_URL;

    const data = {
      "text": payload?.text,
      "blocks": [
        {
    		"type": "section",
    		"block_id": "section567",
    		"text": {
    			"type": "mrkdwn",
    			"text": payload?.text
    		},
    		"accessory": {
    			"type": "video",
    			"image_url": payload?.video_url,
    			"alt_text": payload?.description
    		}
    	}
    ]
    }

    let res = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
    })

    if (res.status === 200) {
        // alert("Message Sent!")
        console.log('video logged to slack');
    } else {
        console.log('video not logged to slack');
        // alert("There was an error.  Please try again later.")
    }

}

export default logUsage;
