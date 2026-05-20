using Microsoft.AspNetCore.Mvc;
using libzkfpcsharp;
using System.Threading;
using System.Linq;

namespace FingerprintService.Controllers
{
    [ApiController]
    [Route("fingerprint")]
    public class FingerprintController : ControllerBase
    {

        static IntPtr cacheDB = IntPtr.Zero;

        [HttpGet("scan")]
public IActionResult Scan()
{
    IntPtr devHandle = IntPtr.Zero;

    try
    {
        int ret = zkfp2.Init();

        if (ret != zkfperrdef.ZKFP_ERR_OK)
        {
            return BadRequest($"Init Failed : {ret}");
        }

        cacheDB = zkfp2.DBInit();

        devHandle = zkfp2.OpenDevice(0);

        if (devHandle == IntPtr.Zero)
        {
            zkfp2.Terminate();

            return BadRequest("Device Open Failed");
        }

        byte[] fpImage = new byte[1024 * 1024];
        byte[] template = new byte[2048];

        int templateLen = 2048;

        bool captured = false;

        for (int i = 0; i < 60; i++)
        {
            ret = zkfp2.AcquireFingerprint(
                devHandle,
                fpImage,
                template,
                ref templateLen
            );

            if (ret == zkfperrdef.ZKFP_ERR_OK)
            {
                captured = true;
                break;
            }

            Thread.Sleep(500);
        }

        if (!captured)
        {
            return BadRequest(
                $"Fingerprint Capture Failed : {ret}"
            );
        }

        byte[] finalTemplate =
            template.Take(templateLen).ToArray();

        string fingerprintTemplate =
            Convert.ToBase64String(finalTemplate);

        return Ok(new
        {
            template = fingerprintTemplate
        });
    }
    finally
    {
        if (devHandle != IntPtr.Zero)
        {
            zkfp2.CloseDevice(devHandle);
        }

        if (cacheDB != IntPtr.Zero)
        {
            zkfp2.DBFree(cacheDB);
        }

        zkfp2.Terminate();
    }
}


       [HttpPost("match")]
public IActionResult Match(
    [FromBody] FingerprintRequest req
)
{

    cacheDB = zkfp2.DBInit();

    byte[] storedTemplate =
        Convert.FromBase64String(
            req.StoredTemplate
        );

    byte[] newTemplate =
        Convert.FromBase64String(
            req.NewTemplate
        );

    int score = zkfp2.DBMatch(
        cacheDB,
        storedTemplate,
        newTemplate
    );

    zkfp2.DBFree(cacheDB);

    return Ok(new
    {
        matched = score > 0,
        score = score
    });

}

    }


    public class FingerprintRequest
    {
        public string StoredTemplate { get; set; }

        public string NewTemplate { get; set; }
    }

}