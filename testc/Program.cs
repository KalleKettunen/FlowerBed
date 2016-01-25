using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Npgsql;

namespace testc
{
    class Program
    {
        static void Main(string[] args)
        {
            var ctx = new NpgsqlConnection("Server=127.0.0.1;Port=5432;Database=FlowerBed;User Id=kalle;Password=1n<<uP1n<<u");
            ctx.Open();
            var c = new NpgsqlCommand("select * from plant", ctx);
            var q = c.ExecuteReader();
            ctx.Close();
            
        }
    }
}
